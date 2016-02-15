<?php
function minify_output($buffer) {
	$search = array( '/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s' );
	$replace = array( '>', '<', '\\1' );
	if (preg_match("/\<html/i",$buffer) == 1 && preg_match("/\<\/html\>/i",$buffer) == 1) {
		$buffer = preg_replace($search, $replace, $buffer);
	}
	return $buffer;
}
ob_start("minify_output");
/*
function ob_html_compress($buf){
    return str_replace(array("\n","\r","\t"),'',$buf);
}

ob_start("ob_html_compress");*/
?>
<?php 
include('lib/Routes.php'); ?>
<?php $r = filter_input(INPUT_GET, 'r'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="shortcut icon" type="image/x-icon" href="./favicon.ico">
	<title>Planilha Aluno</title>
	<link href="./css/font-awesome.css" rel="stylesheet" />
	<link rel="stylesheet" type="text/css" href="./css/jquery.gritter.css" />
	<link rel="stylesheet" type="text/css" href="./css/style.css">
	<link href="./css/css.min.css" rel="stylesheet">
</head>
<body>
	<section id="container">
		<?php include('left.php')?>
		<section id="main-content">
		<section class="wrapper">
		<div class="row">
		<div class="col-lg-9 main-chart">
		<?=Routes::get($r);?>
	</div>
	<?php include('right.php')?>
	</div><! --/row -->
	</section>
	</section>
	<?php include('footer.php')?>
	</section>
	<script src="./js/chart.min.js"></script>
	<!--[if lt IE 9]>
	<script src="./js/html5shiv.min.js"></script>
	<script src="./js/respond.min.js"></script>
	<![endif]-->
	<script src="./js/jquery.min.js"></script>
	<script src="./js/bootstrap.min.js"></script>
	<script src="js/jquery.dcjqaccordion.min.js"></script>
	<script src="./js/jquery.scroll.min.js"></script>
	<script src="./js/common.scripts.js"></script> 
	<script src="./js/jquery.gritter.min.js"></script>
	<script src="./js/gritter.conf.js"></script>
	<script src="./js/jquery.sparkline.js"></script>
	<script src="./js/sparkline.chart.min.js"></script>
	<?php if(!empty($r)) { ?>
	<script>
	page = <?=(isset($_GET['page']) && !empty($_GET['page']) ? (int) $_GET['page']: 1)?>;
	limit = <?=(isset($_GET['limit']) && !empty($_GET['limit']) ? (int) $_GET['limit']: 10)?>;
	</script>
	<script src="./js/commom.js"></script>
		<?php if(file_exists("./js/$r.js")) {  ?>
			<script src="./js/<?=$r?>.js"></script>
		<?php } ?>
	<?php } ?>
	<?php $scripts = Routes::get_scripts();
	if(!empty($scripts))
		foreach ($scripts as $script){
			echo "<script src='$script'></script>\n";
		} ?>
		<script type="text/javascript">
		$(document).ready(function () {
			r = "<?=$r?>";/*route var*/
			$('.' + r).addClass('dcjq-parent active'); /*left menu active*/
			$('.' + r).parent().find('.sub').attr('style', 'display: block; overflow: hidden;');/*left menu submenu active*/
			return false;
		});
		</script>
	</body>
	</html>
<?php ob_end_flush();
