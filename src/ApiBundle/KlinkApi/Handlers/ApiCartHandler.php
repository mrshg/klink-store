<?php
namespace ApiBundle\KlinkApi\Handlers;

class ApiCartHandler extends ApiHandler
{
    public function deleteCart()
    {
        return $this->makeDeleteRequest(
            '/cart/'
        );
    }

    public function getCart($headers, $responseFormat = null)
    {
        return $this->makeGetRequest(
            '/cart/',
            null,
            $headers,
            $responseFormat
        );
    }

    public function postCart($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/cart/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function deleteCartItem($itemId, $headers, $responseFormat = null)
    {
        $route = '/cart/item/'.$itemId.'/';

        return $this->makeDeleteRequest(
            $route,
            null,
            $headers,
            $responseFormat
        );
    }

    public function patchCartItem($itemId, $data, $headers, $responseFormat = null)
    {
        $route = '/cart/item/'.$itemId.'/';

        return $this->makePatchRequest(
            $route,
            $data,
            $headers,
            $responseFormat
        );
    }

    public function putCartTip($data, $headers, $responseFormat = null)
    {
        return $this->makePutRequest(
            '/cart/tip/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function putCartCoupon($data, $headers, $responseFormat = null)
    {
        return $this->makePutRequest(
            '/cart/coupon/',
            $data,
            $headers,
            $responseFormat
        );
    }

    public function postCartPackage($data, $headers, $responseFormat = null)
    {
        return $this->makePostRequest(
            '/cart/package/',
            $data,
            $headers,
            $responseFormat
        );
    }
}