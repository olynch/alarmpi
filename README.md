#Alarm Pi

I don't have a smartphone for the next few weeks, but because I can sleep through alarms that don't change (ie. aren't music), I need some way of getting a musical alarm. Obviously, the simplest solution was to write my own for the raspberry pi. This is a meteor app custom-made for that very purpose. It provides an interface to set times for alarms, make them recurring on certain days, and create playlists of songs from youtube to play as the alarm sound.

# Todo

- [x] Write the UI for configuring the settings in the database
- [ ] Write the backend code to read the database and play the songs at the right time
- [ ] Write more UI for snooze/turn off functions (maybe hook up physical button with arduino?)
- [ ] Set up the raspberry pi to automatically start up everything when it boots
