# The Pomodoro Timer

I work your typical 8-5 job, and to increase my productivity, I've been using the [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique). 

I would often, though, find myself either working in cycles that were too short or cycles that were too long. So I made a light weight electron timer app to help!

This is my first ever electron app... and first thing I've ever truly put into production. So pull requests and pointers are more than welcome! 


The timer defaults to 25 minutes, clicking start starts the timer and a notification will let you know when the timer is finished if you have the program pinned to start. 

Currently you can't disable notifications within the app (I'm working on it), but you can mute a single app on windows. 

## Usage
**Custom Timer** 
Setting a custom timer works, but if after your first custom cycle you hit `Reset`, the timer will default back to 25 minutes. You can, instead, just hit `Start` again. This works from both the application main window and from the context (right-click) menu from the tray. 

