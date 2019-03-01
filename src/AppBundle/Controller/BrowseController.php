<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class BrowseController extends Controller
{
    public function browseDrinksAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $storeData = array(
            'stores' => $stores
        );

        $categories = $this->get('klink_api_categories_handler')->getCategories($storeData, 'array');
        $home = $this->get('klink_home_handler')->getHome($storeData, 'array');

        $popularId = null;

        foreach ($categories as $category) {
            if ($category['name'] == 'Popular') {
                $popularId = $category['id'];
                break;
            }
        }
        //browse default category if no popular items
        if ($popularId == null) {
            return $this->redirectToRoute('_browse_drinks_category', array(
                'categoryId' => 3 //beer
            ));
        }


        $productData = array(
            'stores' => $stores,
            'categories' => array($popularId),
        );

        $popularProducts = $this->get('klink_api_product_handler')->getProducts($productData, 'array');

        return $this->render('AppBundle:Browse:index.html.twig', array(
            'categories' => $categories,
            'products' => array_slice($popularProducts, 0, 10),
            'home' => $home,
        ));
    }

    public function browseAllAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $storeData = array(
            'stores' => $stores
        );

        $categories = $this->get('klink_api_categories_handler')->getCategories($storeData, 'array');
        $products = $this->get('klink_api_product_handler')->getProducts($storeData, 'array');

        return $this->render('AppBundle:Browse:drinks.html.twig', array(
            'categories' => $categories,
            'products' => $products,
            'hasMore' => ($products['page'] != $products['pages']) ? true : false,
        ));
    }

    public function browseDrinksByCategoryAction($categoryId)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $storeData = array(
            'stores' => $stores
        );

        $categories = $this->get('klink_api_categories_handler')->getCategories($storeData, 'array');

        foreach($categories as $category) {
            if($category['id'] == $categoryId) {
                $categoryName = $category['name'];
                $subcategories = $category['children'];
            }
        }

        $data = array(
            'stores' => $stores,
            'categories' => array($categoryId),
        );

        $products = $this->get('klink_api_product_handler')->getProducts($data, 'array');

        return $this->render('AppBundle:Browse:drinks.html.twig', array(
            'categories' => $categories,
            'categoryName' => $categoryName,
            'subcategories' => $subcategories,
            'products' => $products,
            'hasMore' => ($products['page'] != $products['pages']) ? true : false,
        ));
    }

}