<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiAddressHandler extends ApiHandler
{
    public function getAddressSuggestions($data, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/address-suggestions/',
            $data,
            null,
            $responseFormat
        );
    }

    public function getGeoCode($data, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/geocode/',
            $data,
            null,
            $responseFormat
        );
    }

    public function getGeoCodeReverse($data, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/geocode-reverse/',
            $data,
            null,
            $responseFormat
        );
    }
}