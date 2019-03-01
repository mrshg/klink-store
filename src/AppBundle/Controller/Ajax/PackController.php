<?php
namespace AppBundle\Controller\Ajax;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class PackController extends Controller
{
    public function packModalAction($packId)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $data = array(
            'stores' => $stores,
        );

        $pack = $this->container->get('klink_api_package_handler')->getPackage($packId, $data, 'array');

        return $this->renderView('AppBundle:Modals:pack.html.twig', array(
            'pack' => $pack,
        ));
    }
}