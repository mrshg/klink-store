<?php
namespace ApiBundle\KlinkApi\Handlers;

use AppBundle\Entity\User;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Validator\Constraints\DateTime;

class UserHandler
{
    /**
     * @var Session
     */
    protected $session;

    /**
     * @var ApiHandler
     */
    protected $apiSecurityHandler;

    /**
     * UserHandler constructor.
     *
     * @param Session $session
     * @param ApiSecurityHandler $apiSecurityHandler
     */
    public function __construct(Session $session, ApiSecurityHandler $apiSecurityHandler)
    {
        $this->session = $session;
        $this->apiSecurityHandler = $apiSecurityHandler;
    }

    public function authUserFromSession()
    {
        try {
            /** @var User $user */
            $user = $this->getUserFromSession();
            if(!$user instanceof User) {
                throw new UsernameNotFoundException();
            }
            $dateTime = new \DateTime();

            if ($user->getExpiresIn() < $dateTime) {
                $userData = $this->apiSecurityHandler->refreshToken($user->getRefreshToken());
                $user = $this->processUser($user, $userData);
            }
        } catch (\Exception $e) {
            throw new UsernameNotFoundException($e->getMessage());
        }

        return $user;
    }

    /**
     * From Login form
     *
     * @param User $user
     *
     * @return \Buzz\Message\Response
     */
    public function authUserWithUsernameAndPassword(User $user)
    {
        try {
            $userData = $this->apiSecurityHandler->authUserWithUsernameAndPassword($user);
            $user = $this->processUser($user, json_decode($userData));
        } catch (\Exception $e) {
            throw new UsernameNotFoundException($e->getMessage());
        }

        return $user;
    }

    private function processUser(User $user, $data)
    {
        $date = new \DateTime();
        $date->modify('+'.$data->expires_in.' seconds');

        $user->setAccessToken('Bearer '.$data->access_token);
        $user->setExpiresIn($date);
        $user->setTokenType($data->token_type);
        $user->setRefreshToken($data->refresh_token);

        return $user;
    }

    /**
     * @return User
     */
    private function getUserFromSession()
    {
        /** @var UsernamePasswordToken $usernamePasswordToken */
        $usernamePasswordToken = unserialize($this->session->get('_security_main'));

        if($usernamePasswordToken instanceof UsernamePasswordToken) {
            return $usernamePasswordToken->getUser();
        }

        return null;
    }
}