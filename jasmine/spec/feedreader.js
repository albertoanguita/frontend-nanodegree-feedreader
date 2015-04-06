/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('have a non-empty URL', function () {
            // loop through each feed in allFeeds
            allFeeds.forEach(function (element) {
                // for this test to be successful, the element's url should be defined and it should be non-empty (length != 0)
                expect(element.url).toBeDefined();
                expect(element.url.length).not.toBe(0);
            })
        });


        /* Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('have a non-empty name', function () {
            // loop through each feed in allFeeds
            allFeeds.forEach(function (element) {
                // for this test to be successful, the element's name should be defined and it should be non-empty (length != 0)
                expect(element.name).toBeDefined();
                expect(element.name.length).not.toBe(0);
            })
        });

        /**
         * NEW: This test checks that all feeds contained in allFeeds are different from each other (different name and url)
         */
        it('are all different', function () {
            // iterate through allFeeds in a double loop, to make all possible comparisons
            for (var i = 0; i < allFeeds.length; i++) {
                for (var j = i + 1; j < allFeeds.length; j++) {
                    // for this test to be successful, no name or url can be repeated in two feeds
                    expect(allFeeds[i].name).not.toBe(allFeeds[j].name);
                    expect(allFeeds[i].url).not.toBe(allFeeds[j].url);
                }
            }
        });

        /**
         * NEW: This test checks that the user is able to dynamically include new feed sources. This is done
         * through a new function in the code called 'addFeed', which receives a name and url and adds
         * the feed to the page menu. The test must ensure that the list of feeds was actually updated with
         * the new feed (the content of .feed-list was updated, and allFeeds received the new feed)
         *
         * This test fails because the addFeed function is not implemented
         */
        it('accept new feed sources', function () {
            // save the old html content of .feed-list in a variable, for later comparison
            oldHTML = $('.feed-list').html();
            // save the old length of allFeeds, for later comparison
            oldAllFeedsLength = allFeeds.length;
            feedName = 'News from Science';
            feedURL = 'http://news.sciencemag.org/rss/current.xml';
            // add the new feed (THIS METHOD DOES NOT YET EXIST)
            addFeed(feedName, feedURL);
            // the html content of the .feed-list element should have changed
            expect($('.feed-list').html()).not.toBe(oldHTML);
            // allFeeds should have one more element, and the last element should match the new feed
            expect(allFeeds.length).toBe(oldAllFeedsLength + 1);
            expect(allFeeds[allFeeds.length - 1].name).toBe(feedName);
            expect(allFeeds[allFeeds.length - 1].url).toBe(feedURL);
        });
    });


    /* Write a new test suite named "The menu" */
    describe('The menu', function () {
        // the body and menu elements
        bodyElem = $('body');
        menuIcon = $('.menu-icon-link');

        /* Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by default', function () {
            // the visibility of the menu is codified through the class 'menu-hidden' being present or not in
            // the body element. For the test to be successful, this class must be present initially
            expect(bodyElem.hasClass('menu-hidden')).toBeTruthy();
        });

        /* Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('changes visibility when clicked', function () {
            // we first simulate a click on the menu
            menuIcon.trigger("click");
            // at this point, the menu should not be hidden --> the 'menu-hidden' class should not be present
            expect(bodyElem.hasClass('menu-hidden')).toBeFalsy();
            // we simulate a second click on the menu
            menuIcon.trigger("click");
            // the menu should be hidden --> the 'menu-hidden' class should have come back
            expect(bodyElem.hasClass('menu-hidden')).toBeTruthy();
        });
    });

    /* Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function () {
        // the element containing the feed entries
        feedElem = $('.feed');

        beforeEach(function (done) {
            // clear the container element before loading feeds, so we mimic the initial situation (no entries loaded)
            feedElem.html('');
            // load the first feed, using the asynchronous callback so we actually wait for the function to complete
            loadFeed(0, function () {
                done();
            });
        });

        /* Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test wil require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('at least one loads', function (done) {
            // for the test to be successful, there must be at least 1 entry element under the feed element
            expect(feedElem.find('.entry').length).toBeGreaterThan(0);
            done();
        });
    });

    /* Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function () {
        // the element containing the feed entries
        feedElem = $('.feed');

        beforeEach(function (done) {
            // first, load the first feed
            loadFeed(0, function () {
                // In this callback itself we code the subsequent steps of our test
                // store the current content of the feeds container, so we can compare with a later version
                oldHtmlContent = feedElem.html();
                // load the second feed and include the done() call to notify jasmine that the asynch call is over
                loadFeed(1, function () {
                    done();
                });
            });
        });

        /* Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it('makes content change', function (done) {
            // for the test to be successful, the new html content must be different from the old one
            expect(feedElem.html()).not.toBe(oldHtmlContent);
            done();
        });
    });
}());
