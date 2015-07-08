Session.set("curTab", "alarms");
// counter starts at 0
Template.body.helpers({
  alarms: function() {
    return Alarms.find({});
  },
  playlists: function() {
    return Playlists.find({});
  },
  curTab: function(tabnum) {
    return tabnum == Session.get("curTab");
  }
});

Template.body.events({
  "submit .new-alarm": function(e) {
    Meteor.call("addAlarm");
    return false;
  },
  "submit .new-playlist": function(e) {
    Meteor.call("addPlaylist");
    return false;
  },
  "click .tab": function(e) {
    Session.set("curTab", $(e.target).parent().attr("data-tab-id"));
    return false;
  },
  "click .stop-music": function(e) {
    Meteor.call("stopMusic");
  },
  "click .skip-song": function(e) {
    Meteor.call("skipSong");
  }
});

Template.alarm.helpers({
  timeFormat: function(time) {
    return s.sprintf("%02d:%02d", time.hours, time.minutes);
  },
  playlists: function() {
    return Playlists.find({});
  },
  nth: function(arr, idx) {
    return arr[idx];
  },
  eq: function(thing1, thing2) {
    return thing1 == thing2;
  }
});

Template.alarm.events({
  "submit .edit-alarm": function(e) {
    var result = /(\d{2}):(\d{2})/.exec(e.target.time.value);
    var hours = parseInt(result[1]);
    var minutes = parseInt(result[2]);
    var time = { hours: hours, minutes: minutes };
    var days = R.map(function(idx) { return e.target["day" + idx].checked; }, R.range(0, 7));
    var playlist = e.target.playlist.value;
    Meteor.call("editAlarm", this._id, time, days, playlist);
    return false;
  },
  "click .delete-alarm": function(e) {
    Meteor.call("deleteAlarm", this._id);
    return false;
  }
});

Template.playlist.helpers({

});

Template.playlist.events({
  "submit .edit-playlist": function(e) {
    Meteor.call("editPlaylist", this._id, e.target.name.value, e.target.content.value);
    return false;
  },
  "click .play-playlist": function(e) {
    Meteor.call("playPlaylist", this._id);
  },
  "click .delete-playlist": function(e) {
    Meteor.call("deletePlaylist", this._id);
    return false;
  }
})
