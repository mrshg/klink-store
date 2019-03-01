<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class PackageController extends Controller
{
    public function getCollectionsAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_package_handler')->getCollections($data);

        return $response;
    }

    public function getPackagesAction(Request $request)
    {
        $data = $request->query->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_package_handler')->getPackages($data, $headers);

        return $response;
    }

    public function getPackageAction($id)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $data = array(
            'stores' => $stores,
        );

        $response = $this->container->get('klink_api_package_handler')->getPackage($id, $data, $headers);

        return $response;
    }
}