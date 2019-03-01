<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiCreditCardHandler extends ApiHandler
{
    public function getUserCreditCards($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/user/credit-cards/',
            null,
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

    public function deleteUserCreditCard($creditCardId, $headers, $responseFormat = null)
    {
        $route = '/user/credit-cards/'.$creditCardId.'/';

        return $this->makeDeleteRequest(
            $route,
            null,
            $headers,
            $responseFormat
        );
    }

    public function getUserCreditCardDefault($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/user/credit-cards/default/',
            null,
            $headers,
            $responseFormat
        );
    }

    public function postUserCreditCardDefault($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/user/credit-cards/default/',
            $data,
            $headers,
            $responseFormat
        );
    }
}