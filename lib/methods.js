if (Meteor.isServer){
  spawn = Npm.require("child_process").spawn;
  function playSongs(ids) {
    if (ids.length == 0) {
      return;
    }
    else {
      child = spawn("mpv", ["-vo", "null", "https://youtube.com/watch?v=" + ids[0]], { stdio: 'ignore' });
      Child = child;
      child.on("close", function(code) {
        if (!MusicStopped) {
          playSongs(R.slice(1, Infinity, ids).concat([ids[0]]));
        } else {
          MusicStopped = false;
        }
      });
      child.unref();
    }
  }

  function textToPlaylistArray(text) {
      return R.filter(
              function(thing) {
                return thing; // will eval to true if thing is non-null, false otherwise
              },
              R.map(
                function(string) {
                  match = /[^( ]+/.exec(string); // strip away any whitespace or comments in parentheses
                      if (match) {
                        return match[0];
                      } else {
                        return null;
                      }
                      },
                      R.split(",", text)
                )
      );
  }

  function playPlaylistID(id) {
    playSongs(textToPlaylistArray(Playlists.findOne({ _id: id }).content));
  }

  function alarmToSchedule(alarm) {
    return {
      name: alarm._id,
      schedule: function(parser) {
        return {
          schedules: [
          { 
            h: [alarm.time.hours],
            m: [alarm.time.minutes],
            dw: R.filter(function(day) { return alarm.days[day - 1]; }, R.range(1, 8))
          }
          ]
        }
      },
      job: function() {
        playPlaylistID(alarm.playlist);
      }
    }
  }
}
Meteor.methods({
  addAlarm: function() {
    var id = Alarms.insert({
      time: { hours: 0, minutes: 0 },
      playlist: "",
      days: [true, true, true, true, true, true, true] 
    });
    if (Meteor.isServer) {
      SyncedCron.add(alarmToSchedule(Alarms.findOne({_id: id})));
    }
  },
  editAlarm: function(id, time, days, playlist) {
    Alarms.update(
        id,
        {
          $set: { 
            time: time,
            days: days,
            playlist: playlist
          }
        }
        );
    if (Meteor.isServer) {
      SyncedCron.remove(id);
      SyncedCron.add(alarmToSchedule(Alarms.findOne({_id: id})));
    }
  },
  registerAlarm: function(alarm) {
    SyncedCron.add(alarmToSchedule(alarm));
  },
  deleteAlarm: function(id) {
    Alarms.remove(id);
    if (Meteor.isServer) {
      SyncedCron.remove(id);
    }
  },
  addPlaylist: function() {
    Playlists.insert({
      name: "",
      content: ""
    });
  },
  editPlaylist: function(id, name, content) {
    Playlists.update(
        id,
        {
          $set: {
            name: name,
            content: content
          }
        }
    );
  },
  deletePlaylist: function(id) {
    Playlists.remove(id);
  },
  playPlaylist: function(id) {
    if (Meteor.isServer) {
      playPlaylistID(id);
    }
  },
  stopMusic: function() {
    if (Meteor.isServer) {
      if (Child) {
        MusicStopped = true;
        Child.kill();
      }
    }
  },
  skipSong: function() {
    if (Meteor.isServer) {
      if (Child) {
        Child.kill();
      }
    }
  }
});
