<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CategoryController extends Controller
{
    public function getCategoriesAction(array $stores = array(), $responseFormat = null)
    {
        $response = $this->container->get('klink_api_categories_handler')->getCategories($stores, $responseFormat);

        return $response;
    }
}