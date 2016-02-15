-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 15/02/2016 às 15:51
-- Versão do servidor: 5.5.43-0ubuntu0.14.04.1
-- Versão do PHP: 5.5.9-1ubuntu4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de dados: ``
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(450) CHARACTER SET latin1 DEFAULT NULL,
  `email` varchar(450) CHARACTER SET latin1 NOT NULL,
  `endereco` text CHARACTER SET latin1,
  `complemento` text CHARACTER SET latin1,
  `bairro` text CHARACTER SET latin1,
  `cep` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `telefone_fixo` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `telefone_celular` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `responsavel` text CHARACTER SET latin1,
  `pai` text CHARACTER SET latin1,
  `telefone_pai` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `email_pai` text CHARACTER SET latin1,
  `mae` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `telefone_mae` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `email_mae` text CHARACTER SET latin1,
  `observacao` text CHARACTER SET latin1,
  `excluido` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  FULLTEXT KEY `nomefts` (`nome`,`email`,`endereco`,`complemento`,`bairro`,`cep`,`telefone_fixo`,`telefone_celular`,`responsavel`,`pai`,`telefone_pai`,`email_pai`,`mae`,`telefone_mae`,`observacao`,`email_mae`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=279 ;

--
-- Estrutura para tabela `notificacoes`
--

CREATE TABLE IF NOT EXISTS `notificacoes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `info` text NOT NULL,
  `data` text NOT NULL,
  `date_insert` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=86 ;

--
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
