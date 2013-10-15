sudo apt-get update
sudo apt-get -y install vim

#
# Install X-windows and VNC Server
#

# You can try any of the fluxbox, blackbox or openbox
sudo apt-get -y install xorg fluxbox #MINIMAL UBUNTU
sudo apt-get -y install ia32-libs git
sudo apt-get -y install tightvncserver


#
# Oracle (Sun) JDK should be used
#

#sudo apt-get -y install openjdk-6-jdk
sudo aptitude install -y python-software-properties software-properties-common
echo "\n" |sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install -y oracle-java7-installer


#
# Download and unzip Android studio
#

if [ -f "/home/vagrant/android-studio-bundle-130.737825-linux.tgz" ];
then
 echo "Android Studio exists."
else
 echo "Downloading Android Studio ..."
 cd /home/vagrant/ && wget http://dl.google.com/android/studio/android-studio-bundle-130.737825-linux.tgz
 tar -xzf android-studio-bundle-130.737825-linux.tgz
fi

#MEMORY ALLOCATED TO A VAGARNT BOX IS 350MB
#THIS MAY BE SLOW

mkdir ~/workspace


#sudo apt-get -y install gnome-desktop-environment #FULL GNOME DESKTOP
