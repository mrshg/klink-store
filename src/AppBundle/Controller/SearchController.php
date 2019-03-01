<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SearchController extends Controller
{
    public function indexAction(Request $request)
    {
        $searchTerm = $request->query->get('search-term');
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores,
            'name' => $searchTerm,
        );

        $products = $this->get('klink_api_product_handler')->getProducts($data, 'array');

        return $this->render('AppBundle:Search:index.html.twig', array(
            'searchTerm' => $searchTerm,
            'products' => $products,
            'hasMore' => ($products['page'] != $products['pages']) ? true : false,
        ));
    }
}