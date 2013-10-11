sudo apt-get update
sudo apt-get -y install vim

# You can try any of the fluxbox, blackbox or openbox
sudo apt-get -y install xorg fluxbox #MINIMAL UBUNTU
sudo apt-get -y install openjdk-6-jdk git

if [ -f "/home/vagrant/android-studio-bundle-130.737825-linux.tgz" ];
then
 echo "Android Studio exists."
else
 echo "Downloading Android Studio ..."
 cd /home/vagrant/ && wget http://dl.google.com/android/studio/android-studio-bundle-130.737825-linux.tgz
fi

#MEMORY ALLOCATED TO A VAGARNT BOX IS 350MB
#THIS MAY BE SLOW

#sudo apt-get -y install gnome-desktop-environment #FULL GNOME DESKTOP
