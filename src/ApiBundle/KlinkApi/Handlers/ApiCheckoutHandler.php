<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiCheckoutHandler extends ApiHandler
{
//    public function putCheckoutAddress($data)
//    {
//        return $this->makePutRequest(
//            '/cart/checkout/address/',
//            $data
//        );
//    }
//
//    public function getCheckoutShipping($data)
//    {
//        return $this->makeGetRequest(
//            '/cart/checkout/shipping/',
//            $data
//        );
//    }
//
//    public function putCheckoutShipping($data)
//    {
//        return $this->makePutRequest(
//            '/cart/checkout/shipping/',
//            $data
//        );
//    }
//
//    public function getCheckoutPayment($data)
//    {
//        return $this->makeGetRequest(
//            '/cart/checkout/payment/',
//            $data
//        );
//    }
//
//    public function putCheckoutPayment($data)
//    {
//        return $this->makePutRequest(
//            '/cart/checkout/payment/',
//            $data
//        );
//    }

    public function getCheckoutFinalize($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/cart/checkout/finalize/',
            null,
            $headers,
            $responseFormat
        );
    }

//    public function putCheckoutAuthorize($data)
//    {
//        return $this->makePutRequest(
//            '/cart/checkout/authorize/',
//            $data
//        );
//    }

//    public function putCheckoutCapture($data)
//    {
//        return $this->makePutRequest(
//            '/cart/checkout/capture/',
//            $data
//        );
//    }

}