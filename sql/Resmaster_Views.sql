-- Definisi Database View
USE ResourceMaster
GO

-- 1. Jumlah Situs SDA pada masing-masing provinsi
CREATE OR ALTER VIEW JumlahSDAProvinsi AS
SELECT 
    KT.Provinsi AS [Nama Provinsi], 
    COUNT(SS.NamaSitus) AS [Jumlah Situs SDA]
FROM SITUS_SDA AS SS
JOIN KOTA AS KT ON KT.KdKota = SS.KdKota
GROUP BY KT.Provinsi
GO

-- 2. Jumlah Situs Air pada masing-masing provinsi yang memiliki kadar
--    oksigen terlarut (DO) kurang mendukung kehidupan banyak ikan (< 7.5 PPM)
CREATE OR ALTER VIEW JumlahSitusAirAbnormal AS
SELECT 
    KT.Provinsi AS [Nama Provinsi], 
    COUNT(SS.NamaSitus) AS [Jumlah Situs Air Abnormal]
FROM SITUS_AIR AS SA
JOIN SITUS_SDA AS SS ON SS.KdSitus = SA.KdSitusAir
JOIN KOTA AS KT ON SS.KdKota = KT.KdKota
WHERE SA.OksigenTerlarut < 7.50
GROUP BY KT.Provinsi
GO

-- 3. Daftar Blok Rig Pengeboran Offshore dengan kepadatan 
--    minyak mentah Light atau Heavy
CREATE OR ALTER VIEW RigPengeboranOffshoreLight AS
SELECT 
    SS.NamaSitus AS [Nama Blok Rig Pengeboran], 
    MM.APIGravity AS [API Gravity]
FROM RIG_PENGEBORAN AS RP
JOIN MINYAK_MENTAH AS MM ON MM.KdProdMinyak = RP.KdProdMinyak
JOIN SITUS_SDA AS SS ON SS.KdSitus = RP.KdSitusPengeboran
WHERE 
    RP.KlasifikasiLokasi = 'Off'
    AND
    (
        MM.APIGravity > 31.1
    )
    OR
    (
        MM.APIGravity > 10.0
        AND
        MM.APIGravity < 22.3
    )
GO

-- 4. Daftar perusahaan dengan izin usaha di atas 5 tahun
--    dan akan habis masa berlakunya dalam 5 tahun atau kurang,
--    termasuk yang sudah habis masa berlakunya

CREATE OR ALTER VIEW PerusahaanIzinUsaha AS
SELECT 
    P.Nama, 
    DATEADD(DAY, DO.MasaBerlakuHari, DO.TanggalDiperoleh)
        AS [Kadaluwarsa Masa Berlaku],
    (DATEDIFF(
        DAY, DATEADD(DAY, DO.MasaBerlakuHari, DO.TanggalDiperoleh), GETDATE()
        ) * -1)
            AS [Hari Menuju Kadaluwarsa Masa Berlaku]
FROM PERUSAHAAN AS P
JOIN dimiliki_oleh AS DO ON DO.KdPerusahaan = P.KdPerusahaan
JOIN IZIN_USAHA AS IU ON IU.KdIzin = DO.KdIzin
WHERE
    DO.MasaBerlakuHari > (5 * 365)
    AND 
    DATEDIFF(
        DAY, DATEADD(
        DAY, DO.MasaBerlakuHari, DO.TanggalDiperoleh
        ), GETDATE()
    ) > (365 * 5 * -1)
GO

-- 5. Perusahaan yang mengelola pertambangan dengan hasil 
--    tambangnya mengandung besi dan sulfur di atas 30%

CREATE OR ALTER VIEW PertambanganKandunganBesiSulfur AS
SELECT DISTINCT P.Nama
FROM PERUSAHAAN AS P 
JOIN dimanfaatkan_oleh 
    AS DO ON P.KdPerusahaan = DO.KdPerusahaan
JOIN TAMBANG 
    AS T ON DO.KdSitus = T.KdSitusTambang
JOIN menghasilkan_produk_tambang 
    AS MPT ON T.KdSitusTambang = MPT.KdSitusTambang
JOIN PRODUK_TAMBANG 
    AS PT ON MPT.KdProdTambang = PT.KdProdTambang
JOIN mengandung 
    AS ME ON PT.KdProdTambang = ME.KdProdTambang
JOIN UNSUR 
    AS U ON ME.KdUnsur = U.KdUnsur
WHERE 
    (
        U.NamaUnsur = 'Besi' 
        OR 
        U.NamaUnsur = 'Sulfur'
    ) 
    AND ME.Persentase > 30
GO

--------------------------------------------------
--------------------------------------------------
SELECT * FROM PerusahaanIzinUsaha