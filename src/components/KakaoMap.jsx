import React, { useEffect } from "react";

function KakaoMap(props) {
    useEffect(() => {
        // Kakao Maps API 로드 여부 확인 및 동적 로드
        const createScript = () => {
            return new Promise((resolve, reject) => {
                if (window.kakao && window.kakao.maps) {
                    resolve(); // 이미 로드된 경우
                    return;
                }
                const script = document.createElement("script");
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        createScript()
            .then(() => {
                window.kakao.maps.load(() => {
                    
                    // 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
                    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

                    const container = document.getElementById('map');
                    const options = {
                        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3
                    };

                    const map = new window.kakao.maps.Map(container, options);

                    // 장소 검색 객체를 생성합니다
                    const ps = new window.kakao.maps.services.Places();

                    // 키워드로 장소를 검색합니다
                    ps.keywordSearch(props.resturant, placesSearchCB);

                    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
                    function placesSearchCB(data, status, pagination) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                            // LatLngBounds 객체에 좌표를 추가합니다
                            var bounds = new window.kakao.maps.LatLngBounds();

                            for (var i = 0; i < data.length; i++) {
                                displayMarker(data[i]);
                                bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
                            }

                            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                            map.setBounds(bounds);
                        }
                    }

                    // 지도에 마커를 표시하는 함수입니다
                    function displayMarker(place) {
                        // 마커를 생성하고 지도에 표시합니다
                        var marker = new window.kakao.maps.Marker({
                            map: map,
                            position: new window.kakao.maps.LatLng(place.y, place.x)
                        });

                        // 마커에 클릭이벤트를 등록합니다
                        window.kakao.maps.event.addListener(marker, 'click', function () {
                            // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                            infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                            const position = marker.getPosition();
                            console.log(position);
                            const latitude = position.getLat();  // 위도
                            const longitude = position.getLng(); // 경도
                            console.log("위도 : " + latitude);
                            console.log("경도 : " + longitude);

                            // 장소의 정보 (사진, 제목, 설명)
                            const imageUrl = "https://example.com/image.jpg";  // 이미지 URL 예시
                            const title = place.place_name; // 장소의 이름
                            const description = "This is a description of the place."; // 설명 예시

                            // 오버레이에 표시할 HTML content
                            const content = `
                                <div style="padding:10px; background:white; border:1px solid black; border-radius: 10px; width: 200px;">
                                    <img src="${imageUrl}" alt="${title}" style="width:100%; border-radius: 5px;" />
                                    <div style="margin-top: 10px;">
                                        <h4 style="margin: 0; font-size: 14px;">${title}</h4>
                                        <p style="margin: 5px 0 0; font-size: 12px; color: gray;">${description}</p>
                                    </div>
                                </div>
                            `;

                            const customOverlay = new window.kakao.maps.CustomOverlay({
                                position: position,
                                content: content,
                                xAnchor: 0.3,
                                yAnchor: 0.91
                            });

                            customOverlay.setMap(map);
                            
                            // infowindow.open(map, marker);   // 클릭시 해당 마커의 정보 표시

                            // marker.setMap(null);    // 기존 마커 삭제

                            // // 마커 이미지의 이미지 주소입니다
                            // const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

                            // // 마커 이미지의 이미지 크기 입니다
                            // const imageSize = new window.kakao.maps.Size(24, 35); 

                            // // 마커 이미지를 생성합니다    
                            // const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 

                            // // 새로운 마커 생성
                            // const newMarker = new window.kakao.maps.Marker({
                            //     position: position,
                            //     image: markerImage

                            // });

                            // newMarker.setMap(map)
                        });
                    }
                });
            })
            .catch(error => console.error("Kakao Maps API를 로드할 수 없습니다.", error));
    }, [props.resturant]); // props.resturant가 변경될 때마다 useEffect 재실행

    return (
        <div id="map" style={{
            width: '420px',
            height: '250px',
            borderRadius: '14px',
            marginLeft: '55px'
        }}></div>
    );
}

export default KakaoMap;
