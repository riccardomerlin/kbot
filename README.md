# kbot

Extensible [Slack](https://slack.com/) *slash command* integration built
on NodeJs.
Add you own command on Slack and use this project to implement the
functionalities you need to make it running.

The project has these pre-defined slash command extensions:
(work in progress)
* `/ktfs` - allow Slack users to interact with [Microsoft Team Foundation
Server](https://www.visualstudio.com/tfs/). Type `/ktfs help` on a Slack
channel to get a list of possible actions.

## Getting Started
These instructions will get you a copy of the project up and running on your
local machine for development purposes. See deployment for notes on how to
deploy the project on a live system.

```
$ git clone https://github.com/riccardomerlin/kbot.git

$ npm install
```

### Prerequisites

* Node v5.11.1+ installed.
* [Localtunnel](https://localtunnel.github.io/www/) (optional)

### Add a new command

* Create a new file
`./k-commands/yourcommandname/yourcommandname.command.js`.
* Implement a function that takes 3 parameters as input:
    * `text` - the string received from the Slack client
    * `userId` - the Slack user identifier
    * `responseUri` - the uri where to sent async responses to Slack.
* The function has to return a message within 3000 milliseconds
(as per [Slack documentation](https://api.slack.com/slash-commands)),
therefore if your solution might takes longer, you have to implement
it *asynchronously*.
* Export that function as a javascript module.
* Open up the file `config.js`, import the new command module and add a new entry
to the commands object:
    ````javascript
    const yourCommandModule = require('./k-commands/yourcommandname/yourcommandname.command');

    module.exports = {
        commands: {
            '/yourcommandname': yourCommandModule
        }
    }
    ````
* Open up the *Terminal*, go to the project root folder and run
    ```
    $ npm start
    ```

If everything is correct you should see the message:
```
> kbot is listening on port 8080
```

Every Http POST request you send to
`http://localhost:8080/slack/command-listener` will be processed by the app.

### Installing ktfs on local

Create a new [Slash command](https://api.slack.com/slash-commands) called
`ktfs` and fill out all required fields (URL field will be filled later).

To make `ktfs` command working set up the following environment
variables on your local mchine:

```
export slackCommandToken=<provided_slack_command_token>
export TFSUrl=<your_tfs_instance_url>
```
Run the bot
```
$ npm start
```
Make your local bot visible from internet using
[Localtunnel](https://localtunnel.github.io/www/)
```
$ lt --port 8080
``` 
You will see a message with the public url created for your local bot instance
```
> https://xyz.localtunnel.me
```
Copy that url and go back to the *slash command* page. Now on the URL field
paste the local tunnel url and add the actual command listener endpoint path
```
https://xyz.localtunnel.me/slack/command-listener
```

In this way the Slack slash command is connected with your local running
instance of the bot.

To test the command type `/ktfs help` in a Slack channel.
The result will be
```
ktfs is a TFS Slack integration - This is what you can do with /ktfs:

Register you Slack user with TFS services.
/ktfs register tfsToken:{value} tfsUser:{value}

Get registered user infos.
/ktfs userinfo

Queue a new build on your TFS instance
/ktfs qbuild id:{value} project:{value} branch:{value}
```

## Deployment

Deploy this project on [Heroku](https://www.heroku.com) and replace the URL
filed in the Slack slash command page with the url provided by Heroku app.

Add environment variables on Heroku settings page
```
slackCommandToken <provided_slack_command_token>
TFSUrl <your_tfs_instance_url>
```

Deploy code
```
$ git remote add heroku https://git.heroku.com/appname.git
$ git push heroku master
```

## Built With

* [MacBook Pro](https://www.apple.com/macbook-pro/)
* [Visual Studio Code](https://code.visualstudio.com/) - IDE
* [NodeJs](https://nodejs.org/en/) - JavaScript runtime
* [npm](https://www.npmjs.com/) - Node Package Manager

## Authors

* [**Riccardo Merlin**](https://github.com/riccardomerlin) - *Initial work*

See also the list of
[contributors](https://github.com/riccardomerlin/kbot/contributors)
who participated in this project.

## License

This project is licensed under the ISC License - see the
[LICENSE.md](LICENSE.md) file for details
