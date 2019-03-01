<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class AccountController extends Controller
{
    public function accountOverviewAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());
        $profileResponse = $this->get('klink_api_user_handler')->getUserProfile($headers);

        if(!$profileResponse->isSuccessful()) {
            throw new AuthenticationException($profileResponse->getContent());
        }

        $profile = json_decode($profileResponse->getContent(), true);

        return $this->render('AppBundle:Account:index.html.twig', array(
            'profile' => $profile,
            'profileJson' => json_encode($profile),
        ));
    }

    public function accountOrdersAction()
    {

        return $this->render('AppBundle:Account:orders.html.twig');
    }

    public function accountFavoritesAction()
    {

        return $this->render('AppBundle:Account:favorites.html.twig');
    }

    public function accountKlinkCreditAction()
    {

        return $this->render('AppBundle:Account:credit.html.twig');
    }
}