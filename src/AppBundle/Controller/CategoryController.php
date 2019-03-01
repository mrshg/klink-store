<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CategoryController extends Controller
{
    public function getTopMenuCategoriesAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $storeData = array(
            'stores' => $stores
        );

        $categories = $this->get('klink_api_categories_handler')->getCategories($storeData, 'array');

        return $this->render('AppBundle:_Includes:header_categories.html.twig', array(
            'categories' => $categories
        ));
    }
}