<?php
namespace AppBundle\Twig;

class AppExtension extends \Twig_Extension
{
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('price', array($this, 'priceFilter')),
            new \Twig_SimpleFilter('json_decode', array($this, 'json_decode')),
            new \Twig_SimpleFilter('preg_match', array($this, 'pregMatch')),
        );
    }

    public function priceFilter($number, $decimals = 2, $decPoint = '.', $thousandsSep = ',')
    {
        $price = number_format($number/100, $decimals, $decPoint, $thousandsSep);
        $price = '$'.$price;

        return $price;
    }

    public function json_decode($json)
    {
        return json_decode($json, true);
    }

    public function pregMatch($text, $pattern, $returnMatches = false)
    {
        if (preg_match($pattern, $text, $matches)) {
            if ($returnMatches) {
                return $matches;
            }
            return true;
        }

        return false;
    }

    public function getName()
    {
        return 'app_extension';
    }
}