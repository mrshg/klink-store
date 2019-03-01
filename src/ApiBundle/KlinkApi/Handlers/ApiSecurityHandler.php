<?php
namespace ApiBundle\KlinkApi\Handlers;

use AppBundle\Entity\User;

class ApiSecurityHandler extends ApiHandler
{
    public function authUserWithUsernameAndPassword(User $user)
    {
        $params = array(
            'grant_type' => 'password',
            'username' => $user->getUsername(),
            'password' => $user->getPassword(),
            'client_id' => $this->apiSettings['klink_api_client_id'],
            'client_secret' => $this->apiSettings['klink_api_client_secret'],
        );

        $response = $this->makePostRequest('/authentication/', $params);

        if ($response->getStatusCode() != 200) {
            throw new \Exception($response->getContent());
        }

        return $response->getContent();
    }

    public function refreshToken($refreshToken)
    {
        $params = array(
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'client_id' => $this->apiSettings['klink_api_client_id'],
            'client_secret' => $this->apiSettings['klink_api_client_secret'],
        );

        $response = $this->makePostRequest('/authentication/', $params);

        if (!$response->isSuccessful()) {
            throw new \Exception($response);
        }

        return json_decode($response->getContent());
    }

    public function postRegistration($data)
    {
        return $this->makePostRequest(
            '/user/register/',
            $data
        );
    }
}