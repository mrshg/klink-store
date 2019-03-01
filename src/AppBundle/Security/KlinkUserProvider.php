<?php
namespace AppBundle\Security;

use AppBundle\Entity\User;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use ApiBundle\KlinkApi\Handlers\UserHandler;

class KlinkUserProvider implements UserProviderInterface
{
    /**
     * @var UserHandler
     */
    private $klinkApi;

    /**
     * KlinkUserProvider constructor.
     * @param UserHandler $klinkApi
     */
    public function __construct(UserHandler $klinkApi)
    {
        $this->klinkApi = $klinkApi;
    }

    public function loadUserByUsernameAndPassword($username, $password)
    {
        $user = new User($username, $password);

        try {
            $user = $this->klinkApi->authUserWithUsernameAndPassword($user);

        } catch (UsernameNotFoundException $e) {
            throw new UsernameNotFoundException(sprintf($e->getMessage()));
        }

        return $user;
    }

    public function loadUserByUsername($username)
    {
        try {
            $user = $this->klinkApi->authUserFromSession();
        } catch (UsernameNotFoundException $e) {
            throw new UsernameNotFoundException(sprintf($e->getMessage()));
        }

        if ($username != $user->getUsername()) {
            throw new UsernameNotFoundException('Invalid username');
        }

        return $user;
    }

    public function refreshUser(UserInterface $user)
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException('Instances of "%s" are not supported.', get_class($user));
        }

        return $this->loadUserByUsername($user->getUsername());
    }

    public function supportsClass($class)
    {
        return $class === 'AppBundle\Entity\User';
    }
}
