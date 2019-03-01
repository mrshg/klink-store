<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AddressController extends Controller
{
    public function getAddressSuggestionsAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_address_handler')->getAddressSuggestions($data);

        return $response;
    }

    public function getGeoCodeAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_address_handler')->getGeoCode($data);

        return $response;
    }

    public function getGeoCodeReverseAction(Request $request)
    {
        $data = $request->query->all();

        $response = $this->container->get('klink_api_address_handler')->getGeoCodeReverse($data);

        return $response;
    }
}