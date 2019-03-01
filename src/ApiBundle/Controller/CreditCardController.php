<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class CreditCardController extends Controller
{
    public function getUserCreditCardsAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_credit_card_handler')->getUserCreditCards($headers);

        return $response;
    }

    public function postUserCreditCardAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_credit_card_handler')->postUserCreditCard($data, $headers);

        return $response;
    }

    public function deleteCreditCardAction($creditCardId)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_credit_card_handler')->deleteUserCreditCard($creditCardId, $headers);

        return $response;
    }

    public function getDefaultCreditCardAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_credit_card_handler')->getUserCreditCardDefault($headers);

        return $response;
    }

    public function postDefaultCreditCardAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_credit_card_handler')->postUserCreditCardDefault($data, $headers);

        return $response;
    }
}