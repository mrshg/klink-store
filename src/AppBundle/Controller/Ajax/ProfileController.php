<?php
namespace AppBundle\Controller\Ajax;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class ProfileController extends Controller
{
    public function getEditProfileFormAction()
    {
        if(!$this->getUser()) {
            return new JsonResponse('User not logged in', 401);
        }

        $headers = array('Authorization' => $this->getUser()->getAccessToken());

        $profile = $this->get('klink_api_user_handler')->getUserProfile($headers, 'array');

        return $this->render('AppBundle:Modals/Includes:edit_user_form.html.twig', array(
            'profile' => $profile
        ));
    }

    public function getUserIpAddressAction(Request $request)
    {
        $user_ip = $request->getClientIp();

        return new JsonResponse($user_ip);
    }
}