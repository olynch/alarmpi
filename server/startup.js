Meteor.startup(function() {
  SyncedCron.start();
  R.map(function(alarm) { Meteor.call("registerAlarm", alarm) }, Alarms.find({}));
});
