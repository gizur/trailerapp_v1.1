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


Start X (should move this to bootstrap.sh):

```
sudo apt-get install -y tightvncserver
# Select a password
vncserver
```

```
# Create a workspace dir
mkdir ~/workspace
cd ~/workspace

# Clone the repo
git clone git@github.com:gizur/trailerapp_v1.1.git

Unzip android-studio-bundle-130.737825-linux.tgz

RUN ~/android-studio-bundle/eclipse/eclipse
# Choose the default workspace i.e. /home/vagrant/workspace where we have cloned trailer app repo.
# Import the trailerapp_v1.1/Android/Besiktning into workspace

# To create simulator go to http://developer.android.com/training/basics/firstapp/running-app.html
```

Now connect with a VNC client (I'm using Chicken iof the VNC on OSX). Run 'ifconfig' to see the available interfaces. 
I was able to connect in the 192.168.XXX.XXX interface. 


```
vagrant@precise64:~$ ifconfig
eth0      Link encap:Ethernet  HWaddr 08:00:27:88:0c:a6  
          inet addr:10.0.2.15  Bcast:10.0.2.255  Mask:255.255.255.0
          inet6 addr: fe80::a00:27ff:fe88:ca6/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:6764 errors:0 dropped:0 overruns:0 frame:0
          TX packets:3910 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:4784686 (4.7 MB)  TX bytes:315731 (315.7 KB)

eth1      Link encap:Ethernet  HWaddr 08:00:27:0a:a7:2f  
          inet addr:192.168.56.102  Bcast:192.168.56.255  Mask:255.255.255.0
          inet6 addr: fe80::a00:27ff:fe0a:a72f/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:28 errors:0 dropped:0 overruns:0 frame:0
          TX packets:7 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:4928 (4.9 KB)  TX bytes:578 (578.0 B)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)
```

