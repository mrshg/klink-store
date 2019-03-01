<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SecurityController extends Controller
{
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function loginAction()
    {
        if($this->getUser()) {
            return new RedirectResponse('/');
        }

        $authenticationUtils = $this->get('security.authentication_utils');

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        if($error) {
            $this->get('session')->getFlashBag()->add('error', $error->getMessage());
        }

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();


        return $this->render(
            'AppBundle:ErrorPages:notLoggedIn.html.twig',
            array(
                // last username entered by the user
                'last_username' => $lastUsername,
            )
        );
    }

    public function loginSuccessAction()
    {
        $user = $this->get('serializer')->serialize($this->getUser(), 'json');

        return new JsonResponse($user);
    }

    public function loginCheckAction()
    {
        // this controller will not be executed,
        // as the route is handled by the Security system
    }

    public function registerAction(Request $request)
    {
        $apiSecurityHandler = $this->get('klink_api_security_handler');
        $data = $request->request->all();

        $data = $this->processPasswordData($data);

        $response = $apiSecurityHandler->postRegistration($data);

        return $response;
    }

    public function getRegisterFormAction()
    {
        return $this->render('AppBundle:_Includes:signup_form.html.twig');
    }

    public function refreshTokenFromJsAction()
    {
        $user = $this->getUser();

        return new JsonResponse($this->get('serializer')->serialize($user, 'json'));
    }

    private function processPasswordData($data)
    {
        $plainPassword = array(
            'first' => $data['plainPassword'][0],
            'second' => $data['plainPassword'][1],
        );

        $data['plainPassword'] = $plainPassword;

        return $data;
    }
}