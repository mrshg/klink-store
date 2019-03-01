<?php
namespace ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class UserController extends Controller
{
    public function postAddressAction(Request $request)
    {
        $data = $request->request->all();

        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->postUserAddress($data, $headers);

        return $response;
    }

    public function getAddressAction($addressId)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->getUserAddress($addressId, $headers);

        return $response;
    }

    public function deleteAddressAction($addressId)
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->deleteUserAddress($addressId, $headers);

        return $response;
    }

    public function patchAddressAction(Request $request, $addressId)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->patchUserAddress($addressId, $data, $headers);

        return $response;
    }

    public function patchDefaultAddressAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->patchUserDefaultAddress($data, $headers);

        return $response;
    }

    public function getAddressesAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->getUserAddresses($headers);

        return $response;
    }

    public function postCreditCardAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->postUserCreditCard($data, $headers);

        return $response;
    }

    public function postDefaultCreditCardAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->postUserDefaultCreditCard($data, $headers);

        return $response;
    }

    public function getProfileAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->getUserProfile($headers);

        return $response;
    }

    public function patchProfileAction(Request $request)
    {
        $data = $request->request->all();
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->patchUserProfile($data, $headers);

        return $response;
    }

    public function resetPasswordAction(Request $request)
    {
        $data = $request->request->all();

        $response = $this->container->get('klink_api_user_handler')->resetUserPassword($data);

        return $response;
    }

    public function resetPasswordWithPin(Request $request)
    {
        $data = $request->request->all();

        $response = $this->container->get('klink_api_user_handler')->resetUserPasswordWithPin($data);

        return $response;
    }

    public function changePasswordAction(Request $request)
    {
        $data = $request->request->all();

        $response = $this->container->get('klink_api_user_handler')->changeUserPassword($data);

        return $response;
    }

    public function getDefaultAddressAction()
    {
        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $response = $this->container->get('klink_api_user_handler')->getUserAddressDefault($headers);

        return $response;
    }
}