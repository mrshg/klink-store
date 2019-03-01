<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ProductController extends Controller
{
    public function getProductsAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_product_handler')->getProducts($data);

        return $response;
    }
}