const clinicalProfiles = [
            {
                disease: "Acute Myocardial Infarction (AMI)",
                allergy: "Penicillin",
                meds: [
                    { name: "Aspirin", dose: "1 顆 (100mg)", route: "PO", freq: "QD", timeSlots: ["09:00"] },
                    { name: "Clopidogrel", dose: "1 顆 (75mg)", route: "PO", freq: "QDAC", timeSlots: ["07:00"] },
                    { name: "Atorvastatin", dose: "1 顆 (40mg)", route: "PO", freq: "QDPC", timeSlots: ["09:00"] },
                    { name: "Metoprolol", dose: "1 顆 (25mg)", route: "PO", freq: "BID", timeSlots: ["09:00", "17:00"] },
                    { name: "Nitroglycerin Spray", dose: "1 瓶 (0.4mg)", route: "SL", freq: "PRN", timeSlots: [] }
                ],
                treats: [
                    "Continuous ECG Monitoring", "Check V/S Q4H", "Daily Body Weight (Strict Fluid Restriction)", 
                    "Strict I/O Record", "Low Sodium & Low Fat Diet", "Bed Rest & Oxygen Support 2L/min"
                ]
            },
            {
                disease: "Acute Stroke (Cerebrovascular Accident)",
                allergy: "None",
                meds: [
                    { name: "Cerebrolysin", dose: "2 瓶 (10ml)", route: "IV", freq: "Q8H", timeSlots: ["09:00", "17:00", "01:00"] },
                    { name: "Aspirin", dose: "1 顆 (100mg)", route: "PO", freq: "Q6H", timeSlots: ["00:00", "06:00", "12:00", "18:00"] },
                    { name: "Mannitol", dose: "1 瓶 (125ml)", route: "IV", freq: "Q12H", timeSlots: ["09:00", "21:00"] },
                    { name: "Nimodipine", dose: "1 顆 (30mg)", route: "PO", freq: "TID", timeSlots: ["09:00", "13:00", "17:00"] },
                    { name: "Omeprazole", dose: "1 顆 (40mg)", route: "IV", freq: "OM", timeSlots: ["07:00"] }
                ],
                treats: [
                    "GCS & Neurological Sign Q4H", "Q2H Body Position Change", "Swallowing Assessment", 
                    "Strict I/O Record", "V/S Monitoring Q4H", "Fall Prevention Precautions"
                ]
            },
            {
                disease: "Community-Acquired Pneumonia",
                allergy: "Cephalosporins",
                meds: [
                    { name: "Levofloxacin", dose: "1 瓶 (500mg)", route: "IVPB", freq: "QD", timeSlots: ["09:00"] },
                    { name: "Acetylcysteine", dose: "1 包 (600mg)", route: "PO", freq: "BID", timeSlots: ["09:00", "17:00"] },
                    { name: "Combivent Respimat", dose: "2 噴", route: "Inh", freq: "QID", timeSlots: ["09:00", "13:00", "17:00", "21:00"] },
                    { name: "Acetaminophen", dose: "1 顆 (500mg)", route: "PO", freq: "PRN", timeSlots: [] },
                    { name: "Normal Saline Nebulizer", dose: "1 支 (1amp)", route: "Inh", freq: "ON / HS", timeSlots: ["21:00"] }
                ],
                treats: [
                    "Sputum Induction & Culture", "Oxygen Therapy via Nasal Cannula", "Chest Percussion & Drainage", 
                    "V/S Monitoring Q4H", "Encourage Deep Breathing & Coughing", "Fever Care & SpO2 Monitoring"
                ]
            }
        ];

        
function generateDefaultPatients() {
            let data = {};
            const uniqueNames = [
                "林Ｏ資", "張Ｏ豪", "王Ｏ明", "林Ｏ芬", "陳Ｏ國", "張Ｏ雯", "李Ｏ華", "黃Ｏ強",
                "趙Ｏ婷", "周Ｏ偉", "吳Ｏ君", "蔡Ｏ哲", "鄭Ｏ涵", "謝Ｏ宇", "郭Ｏ玲", "邱Ｏ傑",
                "曾Ｏ婷", "洪Ｏ豪", "賴Ｏ如", "許Ｏ翔", "方Ｏ雅", "彭Ｏ安", "江Ｏ慧", "蕭Ｏ誠",
                "傅Ｏ君", "侯Ｏ凱", "白Ｏ萱", "袁Ｏ銘", "石Ｏ萍", "潘Ｏ宇", "簡Ｏ婷", "黎Ｏ偉",
                "歐Ｏ玲", "藍Ｏ傑", "韋Ｏ如", "章Ｏ翔", "唐Ｏ雅", "錢Ｏ安", "施Ｏ慧", "雲Ｏ誠",
                "柏Ｏ君", "孫Ｏ美", "馬Ｏ傑", "羅Ｏ婷", "高Ｏ偉", "陳Ｏ霖", "林Ｏ慧", "周Ｏ傑"
            ];

            // 固定的初始轉入來源：未列出的非空床一律已在病房。
            // 書記在電子白板確認抵達後，仍以雲端 location 更新為「在病房」。
            const initialTransferByBed = {
                '02-1': 'ICU', '07-2': 'ICU', '12-3': 'ICU',
                '03-2': '急診', '06-1': '急診', '10-2': '急診', '14-1': '急診',
                '04-1': '門診', '08-3': '門診', '13-2': '門診',
                '05-2': '其他單位(轉床)', '09-1': '其他單位(轉床)', '11-3': '其他單位(轉床)', '15-1': '其他單位(轉床)'
            };
            let contactCount = 0, airCount = 0;
            let nameIdx = 0;

            for (let room = 1; room <= 15; room++) {
                let roomStr = String(room).padStart(2, '0');
                let bedsInRoom = 3;

                for (let b = 1; b <= bedsInRoom; b++) {
                    let bedKey = `${roomStr}-${b}`;

                    if (bedKey === "01-2" || bedKey === "03-1") {
                        data[bedKey] = { isEmpty: true, realName: "", name: `${bedKey} [空床待清]`, info: "", extra: "", assignedNurse: "", vitals: [], advancedVitals: [], meds: [], treats: [], notes: [], editInfo: {}, bloodRecord: null, consents: {}, medChecked: {}, treatChecked: {}, treatTimestamps: {}, ewsAlert: false, ewsReason: "" };
                        continue;
                    }

                    // 01-3 固定預設為鄭Ｏ心；單床與全病房重置皆透過 generateDefaultPatients() 還原此設定。
                    let pName = (bedKey === "01-1") ? "林Ｏ資" : (bedKey === "01-3" ? "鄭Ｏ心" : uniqueNames[nameIdx++ % uniqueNames.length]);
                    let profile = clinicalProfiles[(room + b) % clinicalProfiles.length];

                    let isolationTag = "";
                    const initialSource = initialTransferByBed[bedKey] || '';
                    let transferTag = initialSource === 'ICU' ? 'ICU轉入' : initialSource;
                    let isArrived = !initialSource;
                    // 隔離標籤與轉入來源獨立設定，不互相排斥。
                    if (contactCount < 3 && (room + b) % 4 === 0) { isolationTag = '接'; contactCount++; }
                    else if (airCount < 2 && (room + b) % 5 === 0) { isolationTag = '氣'; airCount++; }

                    let genderVal = (bedKey === '01-3') ? '女' : (b % 2 === 0 ? '女' : '男');

                    data[bedKey] = {
                        isEmpty: false, isArrived: isArrived,
                        realName: pName, gender: genderVal,
                        name: `${bedKey} ${pName} (${genderVal})`,
                        dob: `1985/04/12`, blood: "O+",
                        info: `1985/04/12 (41Y) | 病例號：103198${room}${b}`,
                        extra: `血型：O+ | 過敏：${profile.allergy} | 診斷：${profile.disease}`,
                        isolation: isolationTag, transferTag: transferTag,
                        assignedNurse: "",
                        hasBlood: (bedKey === "01-1" || bedKey === "01-3"),
                        hasConsent: (bedKey === "01-1" || bedKey === "01-3"),
                        hasIO: true, hasGCS: true, hasMP: true,
                        ewsAlert: false,
                        ewsReason: "",
                        vitals: [],
                        advancedVitals: [],
                        meds: JSON.parse(JSON.stringify(profile.meds)),
                        treats: profile.treats,
                        notes: [
                            { id: 1, time: "08:10", content: `病人生命徵象穩定，遵醫囑妥善照護中。`, status: "saved", creator: "許Ｏ媃", photo: null, part: "一般照護" }
                        ],
                        location: initialSource || "在病房",
                        watchLocation: { top: "45%", left: "40%", desc: `${room}房` },
                        editInfo: { name: `${pName}`, dob: "1985/04/12", blood: "O+", allergy: profile.allergy, disease: profile.disease, contact: "林大華 (家屬)", phone: "0912-345678" },
                        bloodRecord: null, consents: {}, medChecked: {}, treatChecked: {}, treatTimestamps: {}
                    };
                }
            }
            // 初始化示範資料僅固定 01-1、01-3 有待輸血醫囑；兩床仍須另行簽署輸血治療同意書。
            const bloodBeds = new Set(['01-1', '01-3']);
            Object.entries(data).forEach(([key, patient]) => {
                if (patient.isEmpty) return;
                patient.hasBlood = bloodBeds.has(key);
                patient.hasConsent = bloodBeds.has(key);
                patient.bloodStatus = bloodBeds.has(key) ? '待輸血' : '';
                patient.bloodRecord = null;
                // 保留每床固定的轉入來源，不再隨機覆蓋；實際到院狀態由書記病房管理的雲端 location 控制。
                if (patient.transferTag && patient.isArrived === false) patient.location = patient.transferTag === 'ICU轉入' ? 'ICU' : patient.transferTag;
                else patient.location = '在病房';
            });
            return data;
        }

        
window.makeOriginalPatients=generateDefaultPatients;

