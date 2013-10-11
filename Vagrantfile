# -*- mode: ruby -*-
# vi: set ft=ruby :

#
# Start VM with docker installed
#


Vagrant.configure("2") do |config|

  #
  # A local virtualbox
  #
  # Using a bridged network instead of NAT (the VM will apear to be on the same network as the host)
  #

  config.vm.define :vb do |vb_config|
    vb_config.vm.box = "precise64"
    vb_config.vm.box_url = "http://files.vagrantup.com/precise64.box"
    config.ssh.forward_x11 = true

    config.vm.network :private_network, ip: "192.168.56.102"
    vb_config.vm.network  :forwarded_port, guest: 8080, host: 8080, auto_correct: false
    vb_config.vm.provision :shell, :path => "init.sh"
  end


  config.vm.provider :vb do |v|
    v.gui = true
  end

end
