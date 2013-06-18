all:

gizur:
	@echo "=================================================="
	@echo "                                                  "
	@echo "     **** ***** ***** *   * ****   ****  ****    "
	@echo "    *       *      *  *   * *   *  *   * *   *    "
	@echo "    *  **   *     *   *   * *****  ***** *****    "
	@echo "    *   *   *    *    *   * * *    *   * *   *    "
	@echo "     **** ***** *****  ***  *  **  *   * ****     "
	@echo "                                                  "
	@echo "=================================================="
iOS-clean: gizur
	@echo "*******************************"
	@echo "Cleaning ../iOS/Besiktning/www/"
	@echo "*******************************"
	rm -f ../iOS/Besiktning/www/index.html
	rm -fr ../iOS/Besiktning/www/css
	rm -fr ../iOS/Besiktning/www/img
	rm -fr ../iOS/Besiktning/www/js
	@echo "Cleaned ../iOS/Besiktning/www/"
iOS-prepare: gizur iOS-clean
	@echo "***********************************************************************"
	@echo "Coping from ../Android/Besiktning/assets/www/ to ../iOS/Besiktning/www/"
	@echo "***********************************************************************"
	cp -f ../Android/Besiktning/assets/www/index.html ../iOS/Besiktning/www/
	cp -fr ../Android/Besiktning/assets/www/css ../iOS/Besiktning/www/
	cp -fr ../Android/Besiktning/assets/www/img ../iOS/Besiktning/www/
	cp -fr ../Android/Besiktning/assets/www/js ../iOS/Besiktning/www/
	cp -f ./iOS/lib/cordova-2.6.0.js ../iOS/Besiktning/www/js/lib/
	@echo "Copied from ../Android/Besiktning/assets/www/ to ../iOS/Besiktning/www/"
