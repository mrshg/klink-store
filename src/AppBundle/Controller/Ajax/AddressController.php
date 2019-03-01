<?php
namespace AppBundle\Controller\Ajax;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class AddressController extends Controller
{
    public function getEditAddressFormAction($addressId)
    {
        if(!$this->getUser()) {
            return new JsonResponse('User not logged in', 401);
        }

        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $address = $this->get('klink_api_user_handler')->getUserAddress($addressId, $headers, 'array');

        return $this->render('AppBundle:Modals/Includes:address_form.html.twig', array(
            'address' => $address,
        ));
    }
}