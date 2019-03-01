<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CartController extends Controller
{
    public function deleteCartAction()
    {
        $response = $this->container->get('klink_api_cart_handler')->deleteCart();

        return $response;
    }

    public function getCartAction(Request $request)
    {
        $data = $request->query->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->getCart($data, $headers);

        return $response;
    }

    public function postCartAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->postCart($data, $headers);

        return $response;
    }

    public function deleteCartItemAction($itemId)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->deleteCartItem($itemId, $headers);

        return $response;
    }

    public function patchCartItemAction(Request $request, $itemId)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->patchCartItem($itemId, $data, $headers);

        return $response;
    }

    public function putCartTipAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->putCartTip($data, $headers);

        return $response;
    }

    public function putCartCouponAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->putCartCoupon($data, $headers);

        return $response;
    }

    public function postCartPackageAction(Request $request)
    {
        $data = $request->request->all();

        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_cart_handler')->postCartPackage($data, $headers);

        return $response;
    }
}