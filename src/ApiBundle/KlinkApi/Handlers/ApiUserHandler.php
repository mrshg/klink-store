<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiUserHandler extends ApiHandler
{
    public function postUserAddress($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/user/addresses/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function deleteUserAddress($addressId, $headers, $responseFormat = null)
    {
        $route = '/user/addresses/'.$addressId.'/';

        return $this->makeDeleteRequest(
            $route,
            null,
            $headers,
            $responseFormat
        );
    }

    public function patchUserAddress($addressId, $data, $headers, $responseFormat = null)
    {
        $route = '/user/addresses/'.$addressId.'/';

        return $this->makePatchRequest(
            $route,
            $data,
            $headers,
            $responseFormat
        );
    }

    public function getUserAddress($addressId, $headers, $responseFormat = null)
    {
        $route = '/user/addresses/'.$addressId.'/';

        return $this->makeGetRequest(
            $route,
            null,
            $headers,
            $responseFormat
        );
    }

    public function getUserAddresses($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/user/addresses/',
            null,
            $headers,
            $responseFormat
        );
    }

    public function postUserDefaultCreditCard($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/user/credit-cards/default/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function postUserCreditCard($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/user/credit-cards/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function patchUserDefaultAddress($data, $headers, $responseFormat = null)
    {
        return $this->makePatchRequest(
            '/user/addresses/default/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function getUserProfile($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/user/profile/',
            null,
            $headers,
            $responseFormat
        );
    }

    public function patchUserProfile($data, $headers, $responseFormat = null)
    {
        return $this->makePatchRequest(
            '/user/profile/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function resetUserPassword($data, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/user/reset-password/',
            $data,
            null,
            $responseFormat
        );
    }

    public function resetUserPasswordWithPin($data, $responseFormat = null)
    {
        return $this->makePutRequest(
            '/user/reset-password/',
            $data,
            null,
            $responseFormat
        );
    }

    public function changeUserPassword($data, $responseFormat = null)
    {
        return $this->makePatchRequest(
            '/user/change-password/',
            $data,
            null,
            $responseFormat
        );
    }

    public function getUserAddressDefault($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/user/addresses/default/',
            null,
            $headers,
            $responseFormat
        );
    }
}