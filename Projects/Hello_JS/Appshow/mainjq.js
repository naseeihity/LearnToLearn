 // $(document).ready(function(){ });
var AppShowcase=(function(){

var $el = $( '#wrapper' ),
        // device element
        $device = $el.find( '.device' ),
        // the device image wrapper
        $trigger = $device.children( 'a:first' ),
        // the screens
        $screens = $el.find( '.grid >.grid_content> a' ),
        // the device screen image
        $screenImg = $device.find( 'img' ),
        // the device screen title
        $screenTitle = $device.find( '.title' ),
        // HTML Body element
        $body = $( 'body' );

function init() {
                // show grid
                $trigger.on( 'click', showGrid );
                // when a grid´s screen is clicked, show the respective image on the device
                $screens.on( 'click', function() {
                        showScreen( $( this ) );
                        return false;
                } );
        }

function showGrid() {
                $el.addClass( 'gridview' );
                // clicking somewhere else on the page closes the grid view
                $body.off( 'click' ).on( 'click', function() { showScreen(); } );
                return false;
        }

function showScreen( $screen ) {
                $el.removeClass( 'gridview' );
                if( $screen ) {
                        // update image and title on the device
                        $screenImg.attr( 'src', $screen.find( 'img' ).attr( 'src' ) );
                        $screenTitle.text( $screen.find( 'span' ).text() );
                }
        }

        return { init : init };

})();




