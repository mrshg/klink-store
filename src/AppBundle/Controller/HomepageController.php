<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class HomepageController extends Controller
{
    public function indexAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $storeData = array(
            'stores' => $stores,
        );

        $categories = $this->get('klink_api_categories_handler')->getCategories($storeData, 'array');
        $collections = $this->get('klink_api_package_handler')->getCollections($storeData, 'array');
        $home = $this->get('klink_home_handler')->getHome($storeData, 'array');

        $popularId = null;

        foreach ($categories as $category) {
            if ($category['name'] == 'Popular') {
                $popularId = $category['id'];
                break;
            }
        }

        $popularProducts = array();
        if($popularId != null) {
            $productData = array(
                'stores' => $stores,
                'categories' => array($popularId), //popular products category
            );

            $popularProducts = $this->get('klink_api_product_handler')->getProducts($productData, 'array');
        }

        return $this->render('AppBundle:Browse:index.html.twig', array(
            'categories' => $categories,
            'collections' => $collections,
            'products' => array_slice($popularProducts, 0, 10),
            'home' => $home,
        ));
    }
}