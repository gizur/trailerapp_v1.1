Trailer Application 
===================


### Dependency

* Apache Cordova v2.3
* jQuery Mobile

### Test / Style Check Dependency

* node / npm
* nodeunit
* jshint

To build and install

    make

make sure a device is connected before you run the above command.


Development environment
----------------------


Start the VNC server:

```
# Select a password
vncserver
```

Now connect with a VNC client (I'm using Chicken iof the VNC on OSX). Run 'ifconfig' to see the available interfaces. 
I was able to connect in the 192.168.XXX.XXX interface. 


```
vagrant@precise64:~$ ifconfig
...
eth1      Link encap:Ethernet  HWaddr 08:00:27:0a:a7:2f  
          inet addr:192.168.56.102  Bcast:192.168.56.255  Mask:255.255.255.0
...
```

Clone the repo and start the studio

```
cd ~/workspace

# Clone the repo
git clone https://github.com/gizur/trailerapp_v1.1.git
# or git clone git@github.com:gizur/trailerapp_v1.1.git

./android-studio/bin/studio.sh
#RUN ~/android-studio-bundle/eclipse/eclipse
# Choose the default workspace i.e. /home/vagrant/workspace where we have cloned trailer app repo.
# Import the trailerapp_v1.1/Android/Besiktning into workspace

# To create simulator go to http://developer.android.com/training/basics/firstapp/running-app.html
```

