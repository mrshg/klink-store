<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CheckoutController extends Controller
{
//    public function putCheckoutAddressAction(Request $request)
//    {
//        $data = $request->request->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->putCheckoutAddress($data);
//
//        return $response;
//    }

//    public function getCheckoutShippingAction(Request $request)
//    {
//        $data = $request->query->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->getCheckoutShipping($data);
//
//        return $response;
//    }

//    public function putCheckoutShippingAction(Request $request)
//    {
//        $data = $request->request->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->putCheckoutShipping($data);
//
//        return $response;
//    }

//    public function getCheckoutPaymentAction(Request $request)
//    {
//        $data = $request->query->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->getCheckoutPayment($data);
//
//        return $response;
//    }
//
//    public function putCheckoutPaymentAction(Request $request)
//    {
//        $data = $request->request->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->putCheckoutPayment($data);
//
//        return $response;
//    }

    public function getCheckoutFinalizeAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_checkout_handler')->getCheckoutFinalize($headers);

        return $response;
    }

//    public function putCheckoutAuthorizeAction(Request $request)
//    {
//        $data = $request->request->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->putCheckoutAuthorize($data);
//
//        return $response;
//    }

//    public function putCheckoutCaptureAction(Request $request)
//    {
//        $data = $request->request->all();
//
//        $response = $this->container->get('klink_api_checkout_handler')->putCheckoutCapture($data);
//
//        return $response;
//    }
}