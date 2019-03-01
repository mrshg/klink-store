<?php
namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DiscoverController extends Controller
{
    public function indexAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores,
        );

        $collections = $this->get('klink_api_package_handler')->getCollections($data, 'array');
        $home = $this->get('klink_home_handler')->getHome($data, 'array');

        return $this->render('AppBundle:DiscoverOverview:index.html.twig', array(
            'collections' => $collections,
            'home' => $home,
        ));
    }


    public function discoverFeaturedSelectionAction()
    {

        return $this->render('AppBundle:DiscoverFeaturedSelections:index.html.twig');
    }

    public function discoverHostCollectionsAction()
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores,
        );

        $collections = $this->get('klink_api_package_handler')->getCollections($data, 'array');

        return $this->render('AppBundle:DiscoverHostCollections:index.html.twig', array(
            'collections' => $collections,
        ));
    }

    public function singleCollectionAction($collectionId)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();
        $data = array(
            'collections' => array($collectionId),
            'stores' => $stores,
        );
        $collections = $this->get('klink_api_package_handler')->getCollections(array('stores' => $stores), 'array');

        foreach($collections as $collection) {
            if($collection['id'] == $collectionId) {
                break;
            }
        }
        $packs = $this->get('klink_api_package_handler')->getPackages($data, 'array');

        //todo add collection when api ready
        return $this->render('AppBundle:SingleCollection:index.html.twig', array(
            'packs' => $packs,
            'collection' => $collection,
        ));

    }

    public function singlePackAction($collectionId, $packId)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores
        );

        $collections = $this->get('klink_api_package_handler')->getCollections($stores, 'array');

        foreach($collections as $collection) {
            if($collection['id'] == $collectionId) {
                break;
            }
        }

        $pack = $this->get('klink_api_package_handler')->getPackage($packId, $data, 'array');

        return $this->render('AppBundle:SinglePack:index.html.twig', array(
            'pack' => $pack,
            'collection' => $collection,
        ));
    }

    public function singlePackWithoutCollectionAction($packId)
    {
        $stores = $this->get('klink_api_store_handler')->getStoreIds();

        $data = array(
            'stores' => $stores
        );

        $pack = $this->get('klink_api_package_handler')->getPackage($packId, $data, 'array');

        return $this->render('AppBundle:SinglePack:index.html.twig', array(
            'pack' => $pack,
        ));
    }

    public function discoverArticleAction()
    {

        return $this->render('AppBundle:SingleArticle:index.html.twig');
    }

}