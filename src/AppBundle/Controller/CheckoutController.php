<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class CheckoutController extends Controller
{
    public function indexAction(Request $request)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());
        $profileResponse = $this->get('klink_api_user_handler')->getUserProfile($headers);

        if (!$profileResponse->isSuccessful()) {
            throw new AuthenticationException($profileResponse->getContent());
        }

        $profile = json_decode($profileResponse->getContent(), true);

        $cart = $this->get('klink_api_cart_handler')->getCart($headers, 'array');

        $request->getSession()->set('cart_total', $cart['total']);
        return $this->render(
            'AppBundle:Checkout:index.html.twig',
            array(
                'profile' => $profile,
                'profileJson' => json_encode($profile),
                'cart' => $cart,
            )
        );
    }

    public function checkoutPostOrderAction(Request $request)
    {
        $cartTotal = $request->getSession()->get('cart_total');

        return $this->render(
            'AppBundle:Checkout:post-order.html.twig',
            array(
                'cart_total' => $cartTotal
            ));
    }

    public function checkoutReviewAction()
    {

        return $this->render('AppBundle:Checkout:review.html.twig');
    }
}