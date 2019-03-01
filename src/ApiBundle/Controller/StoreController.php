<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class StoreController extends Controller
{
    public function getStoresAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_store_handler')->getStores($data);

        return $response;
    }
}