<?php
namespace ApiBundle\KlinkApi\Handlers;

use AppBundle\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

class ApiStoreHandler extends ApiHandler
{
    private $user;

    private $userHandler;

    public function __construct($apiSettings, TokenStorage $tokenStorage, ApiUserHandler $userHandler)
    {
        parent::__construct($apiSettings);

        $this->user = $tokenStorage->getToken()->getUser();
        $this->userHandler = $userHandler;
    }

    //todo get real coordinates instead of hardcoded
    public function getUserCoordinates()
    {
        $userAddress = $this->getUserDefaultAddress();

        // Get lat and long by address
        $prepAddr = str_replace(' ', '+', $userAddress);
        $geocode = file_get_contents('https://maps.google.com/maps/api/geocode/json?address='.$prepAddr.'&sensor=false');
        $output = json_decode($geocode);
        $latitude = $output->results[0]->geometry->location->lat;
        $longitude = $output->results[0]->geometry->location->lng;

        return array(
            'longitude' => $longitude,
            'latitude' => $latitude,
        );
    }

    public function getStores($responseFormat = null)
    {
        $route = '/stores/';
        $data = $this->getUserCoordinates();

        return $this->makeGetRequest(
            $route,
            $data,
            null,
            $responseFormat
        );
    }

    public function getStoreIds()
    {
        if (!isset($_COOKIE['storeIds'])) {

            return array(1); // sample store
        }

        $storeIds = json_decode($_COOKIE['storeIds']);

        if (empty($storeIds) || !is_int($storeIds[0])) {
            return array(1); // sample store
        }

        return  array($storeIds[0]);
    }

    private function addressToString($address)
    {
        $address = json_decode($address, true);
        $addressString = $address['address_line1'].' ';

        if (isset($address['address_line2'])) {
            $addressString .= $address['address_line2'].' ';
        }

        $addressString .= $address['locality'].' ';
        $addressString .= $address['country_code'].' ';

        return $addressString;
    }

    private function getUserDefaultAddress()
    {
        if ($this->user instanceof User) {
            $headers = array('Authorization' => $this->user->getAccessToken());
            $userAddressResponse = $this->userHandler->getUserAddressDefault($headers);
            if ($userAddressResponse->getStatusCode() == 200) {
                $userAddress = $this->addressToString($userAddressResponse->getContent());
            }
        }
//            todo remove default address
        if (!isset($userAddress)) {
            $userAddress = '1600 Pennsylvania Ave NW Washington DC 20500';
        }

        return $userAddress;
    }
}