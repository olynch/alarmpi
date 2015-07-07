Alarms = new Mongo.Collection("alarms");
Playlists = new Mongo.Collection("playlists");

if (Meteor.isClient) {
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
      Alarms.insert({
        time: { hours: 0, minutes: 0 },
        playlist: "",
        days: [true, true, true, true, true, true, true] 
      });
      return false;
    },
    "submit .new-playlist": function(e) {
      Playlists.insert({
        name: "",
        content: ""
      });
      return false;
    },
    "click .tab": function(e) {
      Session.set("curTab", $(e.target).parent().attr("data-tab-id"));
      return false;
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
      var hours = result[1];
      var minutes = result[2];
      var days = R.map(function(idx) { return e.target["day" + idx].checked; }, R.range(0, 7));
      Alarms.update(
          this._id,
          {
            $set: { 
              time: { hours: parseInt(hours), minutes: parseInt(minutes) },
              days: days,
              playlist: e.target.playlist.value
            }
          }
      );
      return false;
    },
    "click .delete-alarm": function(e) {
      Alarms.remove(this._id);
      return false;
    }
  });

  Template.playlist.helpers({
    
  });

  Template.playlist.events({
    "submit .edit-playlist": function(e) {
      Playlists.update(
          this._id,
          {
            $set: {
              name: e.target.name.value,
              content: e.target.content.value
            }
          }
      );
      return false;
    },
    "click .delete-playlist": function(e) {
      Playlists.remove(this._id);
      return false;
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
