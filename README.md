ctlmngr
=======

A manager for Custom Timelines and excuse to play around with Assetgraph and
React.

![Screenshot](media/screenshot.png)

Setup
-----

**Dev**

```
npm install & bower install
grunt serve
```

**Build**
```
grunt build
```

**API Proxy**

You also need an API proxy. Why not use [twoxpy](http://github.com/passy/twoxpy)? By default it should listen on port 5000.

```bash
git clone https://github.com/passy/twoxpy
cd twoxpy
virtualenv .ve
. .ve/bin/activate
pip install -r requirements.txt
pip install honcho
$EDITOR .env # Set up API keys and stuff
honcho start
```
