# OUSH

OmniUpdate Shell utility was written using Node.js, and it acts as a wrapper for calls to the endpoints in the OU API at developers.omniupdate.com

# Install

Download or clone the project into a local folder, then run:

`npm i`

Next, we'd recommend you link it so you can use the `oush` command instead of running the script with something like `node /path/to/oush.js`
You can do this by running:

`npm link`

If you ever need to remove this tool, you can remove it by navigating to the source folder and run:

`npm unlink`

## What can I do now that this is installed?

You can do really cool stuff! This is largely intended to assist in administrative action commands like enrolling new users, checking files in and out, publishing, and other commands that don't return values.

_HOWEVER_, you can also use this tool to capture the JSON responses from the API. The function always returns the responding object, so if you use this function in a script you'll be able to do something like:

`var JSON_RESPONSE_FROM_OU = oush('get',gadget_token,'users/list')`

The var you make from that will be a valid object.

Cheers!
