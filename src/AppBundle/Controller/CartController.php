<?php
namespace AppBundle\Controller;

use AppBundle\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class CartController extends Controller
{
    public function renderCartAction()
    {
        if(!$this->getUser()) {
            throw new AuthenticationException('You need to be logged in to access cart.');
        }
        $headers = array('Authorization' => $this->getUser()->getAccessToken());
        $cart = $this->get('klink_api_cart_handler')->getCart($headers, 'array');

        return $this->render('AppBundle:_Includes:cart.html.twig', array(
            'cart' => $cart,
        ));
    }
}