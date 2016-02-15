<?php 
require_once('conf/Routes.php');

Class Routes {
	public static $base = BASE_TEMPLATES;
	public static $ext = BASE_EXT;
	public static $file = BASE_FILE_TEMPLATE;
	public static $file_error = BASE_404;

	public static function get($r) {
		if( isset($r))
			self::setFile($r);

		if(!file_exists(self::compose())){
			self::setFile(self::$file_error);
		}

		include(self::compose());
	}

	public static function setFile($value){

		self::$file = $value;
	}

	public static function compose() {
		return self::$base . self::$file . self::$ext;
	}

	public static function get_scripts() {
		$data = $GLOBALS['data'];
		if( isset($data[self::$file]['scripts']) ){
			return $data[self::$file]['scripts'];
		}
	}
};
