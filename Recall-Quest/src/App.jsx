import React, { useEffect, useMemo, useState } from "react";
import QuizCard from "./QuizCard";

const menuItems = ["Dashboard", "Flashcards", "Quiz", "Rankings", "Search", "About"];
const difficulties = ["Easy", "Medium", "Hard"];
const xpPerCorrectAnswer = {
  Easy: 10,
  Medium: 15,
  Hard: 25,
};
const perfectBonusXp = 100;
const maxLevel = 50;
const xpPerLevel = 250;

const moduleBank = [
  {
    module: "Module 1",
    topic: "Networking Today",
    cards: [
      ["Network", "A group of devices connected so they can share data and resources."],
      ["End device", "A device used by people, such as a PC, phone, printer, or server."],
    ],
    questions: [
      ["Easy", "What is the main purpose of a computer network?", ["To share data and resources", "To remove all security risks", "To replace operating systems", "To stop internet access"], 0, "Networks let devices communicate and share resources such as files, printers, and internet access."],
      ["Medium", "Which device is considered an end device?", ["Router", "Switch", "Laptop", "Wireless access point"], 2, "A laptop is an end device because it is used directly by a user to send or receive data."],
      ["Hard", "Why is network reliability important in modern organizations?", ["It makes cables shorter", "It keeps services available when users need them", "It removes the need for addressing", "It prevents every attack automatically"], 1, "Reliable networks reduce downtime so users can keep accessing applications, data, and services."],
    ],
  },
  {
    module: "Module 2",
    topic: "Basic Switch and End Device Configuration",
    cards: [
      ["Hostname", "The configured name used to identify a network device."],
      ["Default gateway", "The router address a host uses to reach remote networks."],
    ],
    questions: [
      ["Easy", "Which command prompt mode is used for basic viewing commands on Cisco IOS?", ["User EXEC", "Global configuration", "Interface configuration", "ROMMON"], 0, "User EXEC mode gives limited access for basic monitoring commands."],
      ["Medium", "What setting lets a host send traffic to networks outside its local LAN?", ["DNS server", "Default gateway", "Console password", "Hostname"], 1, "The default gateway is the router interface used to forward traffic to remote networks."],
      ["Hard", "Why should device configuration be saved after changes?", ["Running configuration is lost after reload", "It changes copper to fiber", "It deletes passwords", "It disables SSH"], 0, "Cisco IOS keeps active changes in running-config, which must be saved to startup-config to survive a reload."],
    ],
  },
  {
    module: "Module 3",
    topic: "Protocols and Models",
    cards: [
      ["Protocol", "A rule or standard that controls how network communication works."],
      ["Encapsulation", "The process of adding protocol headers and trailers to data."],
    ],
    questions: [
      ["Easy", "What does a network protocol define?", ["Communication rules", "Monitor size", "Keyboard layout", "Power outlet type"], 0, "Protocols define rules such as message format, timing, delivery, and error handling."],
      ["Medium", "What happens during encapsulation?", ["Headers are added as data moves down the stack", "IP addresses are erased", "Switches create passwords", "Applications stop sending data"], 0, "Each layer adds its own control information so the receiving device can process the message."],
      ["Hard", "Why are layered models useful?", ["They make every device wireless", "They divide communication into understandable parts", "They remove all routing", "They require one vendor"], 1, "Layered models help people design, troubleshoot, and explain network communication by separating responsibilities."],
    ],
  },
  {
    module: "Module 4",
    topic: "Physical Layer",
    cards: [
      ["Bandwidth", "The capacity of a medium to carry data."],
      ["UTP", "Unshielded twisted-pair copper cable commonly used in Ethernet LANs."],
    ],
    questions: [
      ["Easy", "Which layer sends bits across cables, fiber, or wireless signals?", ["Application", "Physical", "Transport", "Session"], 1, "The Physical layer represents data as electrical, optical, or radio signals."],
      ["Medium", "Which medium uses light pulses to carry data?", ["Fiber-optic cable", "Coaxial cable", "UTP cable", "Serial cable"], 0, "Fiber-optic cable sends data as light, which allows long distances and resistance to electromagnetic interference."],
      ["Hard", "Why can wireless communication be less predictable than wired media?", ["It never uses standards", "Signals can be affected by interference and obstacles", "It has no frames", "It cannot use encryption"], 1, "Wireless signals share open air and can be weakened by walls, distance, and competing radio sources."],
    ],
  },
  {
    module: "Module 5",
    topic: "Number Systems",
    cards: [
      ["Binary", "A base-2 number system using 0 and 1."],
      ["Hexadecimal", "A base-16 number system often used to shorten binary values."],
    ],
    questions: [
      ["Easy", "Which number system uses only 0 and 1?", ["Decimal", "Binary", "Hexadecimal", "Octal"], 1, "Binary uses two symbols, 0 and 1, matching how computers represent bits."],
      ["Medium", "What decimal value is binary 00001010?", ["8", "10", "12", "16"], 1, "Binary 00001010 has the 8 and 2 positions turned on, which equals 10."],
      ["Hard", "Why is hexadecimal useful in networking?", ["It shortens long binary values", "It replaces IP addressing", "It prevents loops", "It encrypts all traffic"], 0, "Hexadecimal gives a compact way to write binary-heavy values such as IPv6 addresses and MAC addresses."],
    ],
  },
  {
    module: "Module 6",
    topic: "Data Link Layer",
    cards: [
      ["Frame", "A Data Link layer unit that carries data across a local link."],
      ["MAC address", "A hardware address used for local Ethernet delivery."],
    ],
    questions: [
      ["Easy", "What is the Data Link layer PDU called?", ["Bit", "Frame", "Packet", "Segment"], 1, "The Data Link layer packages data into frames for delivery over a local medium."],
      ["Medium", "What kind of address is used for local frame delivery?", ["MAC address", "Port number", "Domain name", "URL"], 0, "MAC addresses identify network interfaces on the local network segment."],
      ["Hard", "What does trailer information in a frame commonly help detect?", ["Transmission errors", "Usernames", "Default gateways", "DNS names"], 0, "Frame trailers often include error-checking values such as the FCS."],
    ],
  },
  {
    module: "Module 7",
    topic: "Ethernet Switching",
    cards: [
      ["Switch", "A LAN device that forwards frames based on MAC addresses."],
      ["MAC table", "A table that maps learned MAC addresses to switch ports."],
    ],
    questions: [
      ["Easy", "Which address does a switch learn?", ["MAC address", "DNS name", "URL", "Subnet mask"], 0, "Switches learn source MAC addresses and associate them with incoming ports."],
      ["Medium", "What does a switch do with an unknown unicast frame?", ["Floods it out other ports", "Always drops it", "Changes it to IPv6", "Sends it to DNS"], 0, "If the destination MAC is unknown, the switch floods the frame except out the port it arrived on."],
      ["Hard", "Which table does a switch use to make forwarding decisions?", ["MAC address table", "Routing table", "ARP cache only", "DNS zone"], 0, "The MAC address table tells the switch which port should receive traffic for a known MAC address."],
    ],
  },
  {
    module: "Module 8",
    topic: "Network Layer",
    cards: [
      ["Packet", "A Network layer unit that contains source and destination IP addresses."],
      ["Router", "A device that forwards packets between different networks."],
    ],
    questions: [
      ["Easy", "Which device forwards traffic between different IP networks?", ["Router", "Hub", "Monitor", "Patch panel"], 0, "Routers connect networks and make forwarding decisions using IP addresses."],
      ["Medium", "Which address is used at the Network layer?", ["IP address", "MAC address only", "Port number", "SSID"], 0, "The Network layer uses logical IP addresses to deliver packets between networks."],
      ["Hard", "What does a router do when no route matches a packet destination?", ["Drops it unless a default route exists", "Turns it into a frame", "Sends it to every switch port", "Changes the source IP"], 0, "A router needs a matching route or default route; otherwise it cannot forward the packet."],
    ],
  },
  {
    module: "Module 9",
    topic: "Address Resolution",
    cards: [
      ["ARP", "A protocol that maps IPv4 addresses to MAC addresses on a local network."],
      ["Neighbor Discovery", "IPv6 processes that discover addresses and routers on a local link."],
    ],
    questions: [
      ["Easy", "What does ARP discover?", ["The MAC address for an IPv4 address", "A website password", "A wireless channel", "A transport port"], 0, "ARP resolves a known IPv4 address to the MAC address needed for local frame delivery."],
      ["Medium", "When does a host use the gateway MAC address?", ["When sending to a remote network", "When sending to itself", "When changing its hostname", "When opening a text file"], 0, "For remote destinations, the frame goes to the default gateway MAC address."],
      ["Hard", "Which IPv6 feature replaces ARP behavior?", ["Neighbor Discovery", "NAT overload", "STP", "FTP"], 0, "IPv6 uses Neighbor Discovery messages instead of ARP for local address resolution."],
    ],
  },
  {
    module: "Module 10",
    topic: "Basic Router Configuration",
    cards: [
      ["Router interface", "A router connection that belongs to a specific network."],
      ["Static route", "A manually configured route to a destination network."],
    ],
    questions: [
      ["Easy", "What must a router interface usually have before forwarding IPv4 traffic?", ["An IP address and active status", "A web browser", "A printer name", "A spreadsheet"], 0, "Router interfaces need correct IP settings and must be enabled to forward traffic."],
      ["Medium", "Which command commonly enables a Cisco router interface?", ["no shutdown", "enable secret", "show clock", "copy run start"], 0, "The no shutdown command administratively enables an interface."],
      ["Hard", "Why configure a default route on a small router?", ["To send unknown remote traffic toward an upstream router", "To erase VLANs", "To create a MAC address", "To replace DNS"], 0, "A default route provides a fallback path for destinations not listed more specifically."],
    ],
  },
  {
    module: "Module 11",
    topic: "IPv4 Addressing",
    cards: [
      ["Subnet mask", "A value that separates the network and host parts of an IPv4 address."],
      ["Broadcast address", "An address used to reach all hosts in an IPv4 subnet."],
    ],
    questions: [
      ["Easy", "How many bits are in an IPv4 address?", ["32", "64", "96", "128"], 0, "IPv4 addresses are 32 bits long, usually written in dotted decimal format."],
      ["Medium", "Which address type reaches all hosts in one IPv4 subnet?", ["Broadcast", "Unicast", "Loopback only", "Multicast only"], 0, "An IPv4 broadcast is delivered to every host in the local subnet."],
      ["Hard", "How many usable host addresses are in a /26 IPv4 subnet?", ["30", "62", "126", "254"], 1, "A /26 has 64 total addresses. Subtract network and broadcast addresses to get 62 usable hosts."],
    ],
  },
  {
    module: "Module 12",
    topic: "IPv6 Addressing",
    cards: [
      ["IPv6", "A 128-bit addressing system written in hexadecimal."],
      ["Link-local address", "An IPv6 address used on the local link, commonly starting with FE80."],
    ],
    questions: [
      ["Easy", "How many bits are in an IPv6 address?", ["32", "48", "64", "128"], 3, "IPv6 addresses are 128 bits long."],
      ["Medium", "Which IPv6 prefix commonly identifies a link-local address?", ["FE80::/10", "192.168.0.0/16", "10.0.0.0/8", "FF00::/8 only"], 0, "IPv6 link-local addresses commonly begin with FE80 and are used on the local link."],
      ["Hard", "Why can IPv6 addresses be shortened with ::?", ["It replaces one continuous group of zero hextets", "It removes all host bits", "It turns IPv6 into IPv4", "It disables routing"], 0, "The double colon compresses one continuous run of zero hextets to make IPv6 notation shorter."],
    ],
  },
  {
    module: "Module 13",
    topic: "ICMP",
    cards: [
      ["ICMP", "A protocol used for network messages, errors, and testing."],
      ["Ping", "A tool that sends ICMP Echo Requests to test reachability."],
    ],
    questions: [
      ["Easy", "Which tool commonly tests network reachability with ICMP?", ["ping", "format", "paint", "rename"], 0, "Ping uses ICMP Echo Request and Echo Reply messages to test whether a device is reachable."],
      ["Medium", "What can traceroute help identify?", ["The path packets take", "A user's favorite browser", "A cable color", "A password length"], 0, "Traceroute shows the sequence of routers along the path to a destination."],
      ["Hard", "What does an ICMP destination unreachable message indicate?", ["A device cannot deliver the packet", "A switch learned a MAC", "A password changed", "A file was compressed"], 0, "Destination unreachable messages report that delivery failed for a specific reason."],
    ],
  },
  {
    module: "Module 14",
    topic: "Transport Layer",
    cards: [
      ["TCP", "A reliable Transport layer protocol."],
      ["UDP", "A faster, connectionless Transport layer protocol."],
    ],
    questions: [
      ["Easy", "Which Transport layer protocol is connection-oriented?", ["TCP", "UDP", "IP", "ARP"], 0, "TCP establishes a connection and provides reliable delivery features."],
      ["Medium", "Why might an application use UDP?", ["Lower overhead and faster delivery", "Guaranteed retransmission", "MAC learning", "Subnet masking"], 0, "UDP has less overhead and is useful for traffic that values speed, such as voice or video."],
      ["Hard", "What do port numbers identify?", ["Specific applications or services on a host", "Only physical cables", "Only MAC vendors", "Only wireless channels"], 0, "Port numbers let transport protocols deliver data to the correct application process."],
    ],
  },
  {
    module: "Module 15",
    topic: "Application Layer",
    cards: [
      ["DNS", "An application service that resolves names to IP addresses."],
      ["HTTP", "A protocol used to transfer web content."],
    ],
    questions: [
      ["Easy", "Which protocol is used to load web pages?", ["HTTP", "ARP", "ICMP", "STP"], 0, "HTTP and HTTPS are used by browsers and web servers to exchange web content."],
      ["Medium", "What does DNS do for users?", ["Translates names into IP addresses", "Assigns switch ports", "Builds frames", "Counts hops"], 0, "DNS lets users type names instead of memorizing IP addresses."],
      ["Hard", "Which protocol is commonly used to securely transfer web traffic?", ["HTTPS", "Telnet", "TFTP", "ARP"], 0, "HTTPS protects web traffic by using encryption with HTTP."],
    ],
  },
  {
    module: "Module 16",
    topic: "Network Security Fundamentals",
    cards: [
      ["CIA triad", "Confidentiality, Integrity, and Availability."],
      ["Least privilege", "Giving users only the access they need to do their work."],
    ],
    questions: [
      ["Easy", "What is the purpose of authentication?", ["Verify identity", "Shorten cables", "Assign DNS names", "Count frames"], 0, "Authentication confirms that a user or device is who it claims to be."],
      ["Medium", "Which part of the CIA triad protects data from unauthorized viewing?", ["Confidentiality", "Integrity", "Availability", "Latency"], 0, "Confidentiality focuses on preventing unauthorized access to information."],
      ["Hard", "Why is least privilege important?", ["It limits damage if an account is misused", "It increases broadcast traffic", "It disables routing", "It removes passwords"], 0, "Least privilege reduces risk by limiting what each account can access or change."],
    ],
  },
  {
    module: "Module 17",
    topic: "Build a Small Network",
    cards: [
      ["Troubleshooting", "A structured process for finding and fixing network problems."],
      ["Baseline", "A record of normal network behavior used for comparison."],
    ],
    questions: [
      ["Easy", "What is a good first step when troubleshooting?", ["Identify the problem", "Replace every device", "Erase all settings", "Ignore symptoms"], 0, "Troubleshooting starts by identifying the problem and gathering symptoms."],
      ["Medium", "Why is documentation useful in a small network?", ["It makes settings easier to verify and restore", "It blocks all traffic", "It replaces cables", "It removes users"], 0, "Documentation records IP addresses, device names, ports, and changes so support is easier."],
      ["Hard", "What does a network baseline help you do?", ["Compare current behavior with normal behavior", "Disable every protocol", "Change binary to decimal", "Remove the gateway"], 0, "A baseline gives you normal performance and configuration references for troubleshooting."],
    ],
  },
];

const quizTargets = {
  Easy: 10,
  Medium: 15,
  Hard: 25,
};

const studyGroups = [
  {
    id: "modules-1-5",
    title: "Modules 1-5",
    desc: "Networking Today, IOS basics, protocols, physical layer, and number systems.",
    start: 1,
    end: 5,
  },
  {
    id: "modules-6-10",
    title: "Modules 6-10",
    desc: "Data link, Ethernet switching, network layer, address resolution, and router basics.",
    start: 6,
    end: 10,
  },
  {
    id: "modules-11-17",
    title: "Modules 11-17",
    desc: "IPv4, IPv6, ICMP, transport, applications, security, and small networks.",
    start: 11,
    end: 17,
  },
];

const moduleNumber = (item) => Number(item.module.replace("Module ", ""));

const toQuestion = (item, [difficulty, question, options, answer, explanation]) => ({
  difficulty,
  question: `${item.module}: ${question}`,
  options,
  answer,
  explanation,
});

const makeConceptQuestions = (modules, difficulty) => {
  const cards = modules.flatMap((item) =>
    item.cards.map(([front, back]) => ({
      module: item.module,
      topic: item.topic,
      front,
      back,
    }))
  );

  if (difficulty === "Hard") {
    return cards.flatMap((card, index) => {
      const wrongCards = cards.filter((item) => item.front !== card.front);
      const wrongOptions = [0, 1, 2].map(
        (offset) => wrongCards[(index + offset) % wrongCards.length]
      );

      return [
        {
          difficulty,
          question: `${card.module}: In a troubleshooting scenario, why does ${card.front} matter?`,
          options: [
            card.back,
            wrongOptions[0].back,
            "It is only used to decorate the network diagram.",
            "It removes the need to understand addressing and protocols.",
          ],
          answer: 0,
          explanation: `${card.front} matters because ${card.back.toLowerCase()}`,
        },
        {
          difficulty,
          question: `${card.module}: Which concept would best help with this task: ${card.back}`,
          options: [
            card.front,
            wrongOptions[0].front,
            wrongOptions[1].front,
            wrongOptions[2].front,
          ],
          answer: 0,
          explanation: `${card.front} is the best match because it means: ${card.back}`,
        },
      ];
    });
  }

  return cards.map((card, index) => {
    const wrongCards = cards.filter((item) => item.front !== card.front);
    const wrongOptions = [0, 1, 2].map(
      (offset) => wrongCards[(index + offset) % wrongCards.length]
    );

    if (difficulty === "Easy") {
      return {
        difficulty,
        question: `${card.module}: Which description best matches ${card.front}?`,
        options: [card.back, ...wrongOptions.map((item) => item.back)],
        answer: 0,
        explanation: `${card.front} means: ${card.back}`,
      };
    }

    if (difficulty === "Medium") {
      return {
        difficulty,
        question: `${card.module}: Which term matches this description: ${card.back}`,
        options: [card.front, ...wrongOptions.map((item) => item.front)],
        answer: 0,
        explanation: `The correct term is ${card.front}. This concept belongs to ${card.topic}.`,
      };
    }

    return {
      difficulty,
      question: `${card.module}: Which term matches this description: ${card.back}`,
      options: [card.front, ...wrongOptions.map((item) => item.front)],
      answer: 0,
      explanation: `The correct term is ${card.front}. This concept belongs to ${card.topic}.`,
    };
  });
};

const makeQuestionSet = (modules) => {
  const sourceQuestions = modules.flatMap((item) => item.questions.map((question) => toQuestion(item, question)));

  return difficulties.flatMap((difficulty) => {
    const directQuestions = sourceQuestions.filter((question) => question.difficulty === difficulty);
    const conceptQuestions = makeConceptQuestions(modules, difficulty);
    const mixedQuestions = [...directQuestions, ...conceptQuestions];
    const target = quizTargets[difficulty];

    return Array.from({ length: target }, (_, index) => ({
      ...mixedQuestions[index % mixedQuestions.length],
      id: `${difficulty}-${index}`,
    }));
  });
};

const quizTopics = studyGroups.map((group) => {
  const modules = moduleBank.filter((item) => {
    const number = moduleNumber(item);
    return number >= group.start && number <= group.end;
  });

  return {
    title: `${group.title} Quiz`,
    desc: group.desc,
    questions: makeQuestionSet(modules),
  };
});

const builtInFlashcards = studyGroups.map((group) => {
  const modules = moduleBank.filter((item) => {
    const number = moduleNumber(item);
    return number >= group.start && number <= group.end;
  });

  return {
    ...group,
    cards: modules.flatMap((item) =>
      item.cards.map(([front, back]) => ({
        id: `${item.module}-${front}`,
        module: item.module,
        front,
        back,
        source: "Built-in",
      }))
    ),
  };
});

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const createId = (prefix) => {
  if (window.crypto?.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
};

const isBetterAttempt = (nextAttempt, currentBest) => {
  if (!currentBest) {
    return true;
  }

  const nextPercent = nextAttempt.score / nextAttempt.total;
  const bestPercent = currentBest.score / currentBest.total;

  return (
    nextPercent > bestPercent ||
    (nextPercent === bestPercent && nextAttempt.timeUsed < currentBest.timeUsed)
  );
};

const getLevelInfo = (xp) => {
  const level = Math.min(maxLevel, Math.floor(xp / xpPerLevel) + 1);
  const currentLevelXp = (level - 1) * xpPerLevel;
  const nextLevelXp = level >= maxLevel ? currentLevelXp : level * xpPerLevel;
  const xpIntoLevel = Math.max(0, xp - currentLevelXp);
  const xpNeeded = Math.max(1, nextLevelXp - currentLevelXp);

  return {
    level,
    xpIntoLevel,
    xpNeeded,
    progress: level >= maxLevel ? 100 : Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)),
  };
};

const makeDefaultProfile = (username = "Guest") => ({
  username,
  xp: 0,
  achievements: [],
  attempts: [],
});

const loadSavedUsers = () => {
  try {
    const savedUsers = JSON.parse(window.localStorage.getItem("recallQuestUsers")) || {};
    const oldProfile = JSON.parse(window.localStorage.getItem("recallQuestProfile"));

    if (oldProfile?.username && !savedUsers[oldProfile.username]) {
      return { ...savedUsers, [oldProfile.username]: oldProfile };
    }

    return savedUsers;
  } catch {
    return {};
  }
};

export default function App() {
  const [activeView, setActiveView] = useState("Quiz");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [resultAwarded, setResultAwarded] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [selectedFlashcardGroup, setSelectedFlashcardGroup] = useState("modules-1-5");
  const [profileSearch, setProfileSearch] = useState("");
  const [searchedProfileName, setSearchedProfileName] = useState("");
  const [viewedProfile, setViewedProfile] = useState(null);
  const [loginName, setLoginName] = useState("");
  const [users, setUsers] = useState(loadSavedUsers);
  const [profile, setProfile] = useState(() => {
    const savedUsers = loadSavedUsers();
    const savedCurrentUser = window.localStorage.getItem("recallQuestCurrentUser");

    return savedUsers[savedCurrentUser] || makeDefaultProfile();
  });
  const [customCards, setCustomCards] = useState(() => {
    try {
      const savedCards = JSON.parse(window.localStorage.getItem("recallQuestCards")) || [];
      return Array.isArray(savedCards) ? savedCards : [];
    } catch {
      return [];
    }
  });
  const [cardDraft, setCardDraft] = useState({ front: "", back: "" });
  const [cardMessage, setCardMessage] = useState("");
  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = JSON.parse(window.localStorage.getItem("recallQuestNotes")) || [];
      return Array.isArray(savedNotes) ? savedNotes : [];
    } catch {
      return [];
    }
  });
  const [noteDraft, setNoteDraft] = useState("");

  const currentQuestions = useMemo(() => {
    if (!activeQuiz) {
      return [];
    }

    return activeQuiz.questions.filter((question) => question.difficulty === difficulty);
  }, [activeQuiz, difficulty]);

  const activeFlashcardSet =
    builtInFlashcards.find((group) => group.id === selectedFlashcardGroup) ||
    builtInFlashcards[0];
  const visibleCustomCards = customCards.filter(
    (card) => (card.groupId || "modules-1-5") === activeFlashcardSet.id
  );
  const allFlashcards = [...visibleCustomCards, ...activeFlashcardSet.cards];
  const currentQuestion = currentQuestions[questionIndex];
  const levelInfo = getLevelInfo(profile.xp);
  const savedProfiles = Object.values(users);
  const leaderboard = Object.values(
    savedProfiles
      .flatMap((user) => user.attempts || [])
      .reduce((bestAttempts, attempt) => {
        const key = `${attempt.username.toLowerCase()}-${attempt.quizTitle}-${attempt.difficulty}`;

        if (isBetterAttempt(attempt, bestAttempts[key])) {
          return {
            ...bestAttempts,
            [key]: attempt,
          };
        }

        return bestAttempts;
      }, {})
  ).sort(
    (first, second) =>
      second.score / second.total - first.score / first.total ||
      first.timeUsed - second.timeUsed
  );
  const progress =
    currentQuestions.length > 0
      ? Math.round(((questionIndex + 1) / currentQuestions.length) * 100)
      : 0;
  const isCorrect = currentQuestion !== undefined && selectedAnswer === currentQuestion.answer;
  const resultXp =
    score * xpPerCorrectAnswer[difficulty] +
    (currentQuestions.length > 0 && score === currentQuestions.length ? perfectBonusXp : 0);

  useEffect(() => {
    window.localStorage.setItem("recallQuestCards", JSON.stringify(customCards));
  }, [customCards]);

  useEffect(() => {
    window.localStorage.setItem("recallQuestNotes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem("recallQuestUsers", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (profile.username === "Guest") {
      window.localStorage.removeItem("recallQuestCurrentUser");
      return;
    }

    window.localStorage.setItem("recallQuestCurrentUser", profile.username);
    setUsers((currentUsers) => ({
      ...currentUsers,
      [profile.username]: profile,
    }));
  }, [profile]);

  useEffect(() => {
    if (!activeQuiz || !isFinished || resultAwarded || currentQuestions.length === 0) {
      return;
    }

    const isPerfect = score === currentQuestions.length;
    const earnedXp =
      score * xpPerCorrectAnswer[difficulty] + (isPerfect ? perfectBonusXp : 0);
    const achievementName = `${activeQuiz.title} ${difficulty} Perfect`;
    const attempt = {
      id: `attempt-${Date.now()}`,
      username: profile.username,
      quizTitle: activeQuiz.title,
      difficulty,
      score,
      total: currentQuestions.length,
      timeUsed: timerMinutes * 60 - timeLeft,
      earnedXp,
      completedAt: new Date().toLocaleString(),
    };

    setProfile((currentProfile) => ({
      ...currentProfile,
      xp: currentProfile.xp + earnedXp,
      achievements:
        isPerfect && !currentProfile.achievements.includes(achievementName)
          ? [...currentProfile.achievements, achievementName]
          : currentProfile.achievements,
      attempts: [attempt, ...currentProfile.attempts],
    }));
    setResultAwarded(true);
  }, [
    activeQuiz,
    currentQuestions.length,
    difficulty,
    isFinished,
    profile.username,
    resultAwarded,
    score,
    timeLeft,
    timerMinutes,
  ]);

  useEffect(() => {
    if (!activeQuiz || isFinished || timeLeft <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft((seconds) => {
        if (seconds <= 1) {
          setIsFinished(true);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeQuiz, isFinished, timeLeft]);

  const openView = (item) => {
    setActiveView(item);
    setActiveQuiz(null);
    setSelectedAnswer(null);
    setIsFinished(false);
    setResultAwarded(false);
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timerMinutes * 60);
    setIsFinished(false);
    setResultAwarded(false);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
    setResultAwarded(false);
  };

  const changeDifficulty = (nextDifficulty) => {
    setDifficulty(nextDifficulty);
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timerMinutes * 60);
    setIsFinished(false);
    setResultAwarded(false);
  };

  const changeTimer = (event) => {
    const minutes = Number(event.target.value);
    setTimerMinutes(minutes);

    if (!activeQuiz || selectedAnswer === null) {
      setTimeLeft(minutes * 60);
    }
  };

  const chooseAnswer = (index) => {
    if (selectedAnswer !== null || isFinished) {
      return;
    }

    setSelectedAnswer(index);

    if (index === currentQuestion.answer) {
      setScore((currentScore) => currentScore + 1);
    }
  };

  const goToNextQuestion = () => {
    if (questionIndex === currentQuestions.length - 1) {
      setIsFinished(true);
      return;
    }

    setQuestionIndex((currentIndex) => currentIndex + 1);
    setSelectedAnswer(null);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(timerMinutes * 60);
    setIsFinished(false);
    setResultAwarded(false);
  };

  const addCustomCard = (event) => {
    event.preventDefault();

    if (!cardDraft.front.trim() || !cardDraft.back.trim()) {
      setCardMessage("Add both the front and back of the flashcard.");
      return;
    }

    const newCard = {
      id: createId("custom"),
      groupId: activeFlashcardSet.id,
      module: activeFlashcardSet.title,
      front: cardDraft.front.trim(),
      back: cardDraft.back.trim(),
      source: "Custom",
    };

    setCustomCards((cards) => [
      newCard,
      ...cards,
    ]);
    setCardDraft({ front: "", back: "" });
    setFlippedCardId(null);
    setCardMessage(`Added your card to ${activeFlashcardSet.title}.`);
  };

  const deleteCustomCard = (cardId) => {
    setCustomCards((cards) => cards.filter((card) => card.id !== cardId));
  };

  const addNote = (event) => {
    event.preventDefault();

    if (!noteDraft.trim()) {
      return;
    }

    setNotes((currentNotes) => [
      {
        id: createId("note"),
        text: noteDraft.trim(),
        createdAt: new Date().toLocaleString(),
      },
      ...currentNotes,
    ]);
    setNoteDraft("");
  };

  const deleteNote = (noteId) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
  };

  const searchProfile = (event) => {
    event.preventDefault();
    setSearchedProfileName(profileSearch.trim());
  };

  const login = (event) => {
    event.preventDefault();

    if (!loginName.trim()) {
      return;
    }

    const username = loginName.trim();
    setProfile(users[username] || makeDefaultProfile(username));
    setLoginName("");
    setActiveView("Profile");
  };

  const logout = () => {
    setProfile(makeDefaultProfile());
    window.localStorage.removeItem("recallQuestCurrentUser");
    setActiveView("Quiz");
  };

  const openViewedProfile = (targetProfile) => {
    setViewedProfile(targetProfile);
    setActiveView("ViewedProfile");
  };

  const renderContent = () => {
    if (activeView === "Dashboard") {
      return renderDashboardView();
    }

    if (activeView === "Quiz") {
      return renderQuizView();
    }

    if (activeView === "Flashcards") {
      return renderFlashcardsView();
    }

    if (activeView === "Profile") {
      return renderProfileView();
    }

    if (activeView === "ViewedProfile") {
      return renderViewedProfileView();
    }

    if (activeView === "Rankings") {
      return renderRankingsView();
    }

    if (activeView === "Search") {
      return renderSearchView();
    }

    const viewDetails = {
      Planner: {
        title: "Planner",
        body: "Study Modules 1-5 first, then Modules 6-10, then Modules 11-17. Each quiz has 10 Easy, 15 Medium, and 25 Hard questions.",
      },
      About: {
        title: "About RecallQuest",
        body: "This app uses original practice material inspired by Introduction to Networks topics. Login, XP, achievements, rankings, profile search, and flashcards are saved locally in this browser.",
      },
    };

    const details = viewDetails[activeView];

    return (
      <div className="rounded-2xl bg-slate-800 p-6">
        <p className="text-sm text-cyan-300">{activeView}</p>
        <h2 className="mt-2 text-3xl font-semibold">{details.title}</h2>
        <p className="mt-3 max-w-2xl text-gray-400">{details.body}</p>
      </div>
    );
  };

  const renderDashboardView = () => (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-6">
        <p className="text-sm text-cyan-300">Dashboard</p>
        <h2 className="mt-2 text-3xl font-semibold">Study Notes</h2>
        <p className="mt-2 text-gray-400">
          Create quick notes for topics, reminders, or things you want to review later.
        </p>

        <form onSubmit={addNote} className="mt-5 space-y-3">
          <textarea
            value={noteDraft}
            onChange={(event) => setNoteDraft(event.target.value)}
            placeholder="Write a note..."
            rows="4"
            className="w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
          ></textarea>
          <button
            type="submit"
            className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
          >
            Add note
          </button>
        </form>
      </div>

      <div className="rounded-2xl bg-slate-800 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Your Notes</h3>
          <p className="text-sm text-gray-400">{notes.length} saved</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {notes.length === 0 ? (
            <p className="text-gray-400">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="rounded-xl bg-slate-900 p-4">
                <p className="whitespace-pre-wrap text-gray-100">{note.text}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-400">{note.createdAt}</span>
                  <button
                    type="button"
                    onClick={() => deleteNote(note.id)}
                    className="rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderFlashcardsView = () => (
    <div>
      <div className="mb-6 rounded-2xl bg-slate-800 p-6">
        <p className="text-sm text-cyan-300">Flashcards</p>
        <h2 className="mt-2 text-2xl font-semibold">Built-in and custom cards</h2>
        <p className="mt-2 text-gray-400">
          Choose a module group, click a card to flip it, or create your own card for that group.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {builtInFlashcards.map((group) => (
            <button
              type="button"
              key={group.id}
              onClick={() => {
                setSelectedFlashcardGroup(group.id);
                setFlippedCardId(null);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                selectedFlashcardGroup === group.id
                  ? "bg-cyan-500 text-black"
                  : "bg-slate-900 text-gray-300 hover:bg-slate-700"
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-400">
          Showing {allFlashcards.length} cards for {activeFlashcardSet.title}.
        </p>

        <form onSubmit={addCustomCard} className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="text"
            value={cardDraft.front}
            onChange={(event) => {
              setCardDraft((draft) => ({ ...draft, front: event.target.value }));
              setCardMessage("");
            }}
            placeholder="Front: term or question"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />
          <input
            type="text"
            value={cardDraft.back}
            onChange={(event) => {
              setCardDraft((draft) => ({ ...draft, back: event.target.value }));
              setCardMessage("");
            }}
            placeholder="Back: answer or explanation"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />
          <button
            type="submit"
            className="rounded-lg bg-cyan-500 px-4 py-3 font-medium text-black hover:bg-cyan-400"
          >
            Add card
          </button>
        </form>

        {cardMessage && (
          <p className="mt-3 text-sm text-cyan-300">{cardMessage}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allFlashcards.map((card) => {
          const isFlipped = flippedCardId === card.id;

          return (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-700 bg-slate-800 p-5"
            >
              <button
                type="button"
                onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
                className="min-h-40 w-full text-left"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-slate-900 px-3 py-1 text-xs text-cyan-300">
                    {card.module}
                  </span>
                  <span className="text-xs text-gray-400">{card.source}</span>
                </div>
                <p className="text-lg font-semibold">{isFlipped ? card.back : card.front}</p>
                <p className="mt-4 text-sm text-gray-400">
                  {isFlipped ? "Click to see the front" : "Click to see the answer"}
                </p>
              </button>

              {card.source === "Custom" && (
                <button
                  type="button"
                  onClick={() => deleteCustomCard(card.id)}
                  className="mt-4 rounded-lg bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProfileView = () => (
    <div className="space-y-6">
      <div className="rounded-2xl bg-slate-800 p-6">
        <p className="text-sm text-cyan-300">Profile</p>
        <h2 className="mt-2 text-3xl font-semibold">{profile.username}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-sm text-gray-400">Level</p>
            <p className="mt-1 text-3xl font-semibold text-cyan-300">{levelInfo.level}</p>
            <div className="mt-3 h-2 rounded bg-slate-700">
              <div className="h-2 rounded bg-cyan-400" style={{ width: `${levelInfo.progress}%` }}></div>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {levelInfo.level >= maxLevel
                ? "Max level reached"
                : `${levelInfo.xpIntoLevel} / ${levelInfo.xpNeeded} XP`}
            </p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-sm text-gray-400">Total XP</p>
            <p className="mt-1 text-3xl font-semibold">{profile.xp}</p>
          </div>
          <div className="rounded-xl bg-slate-900 p-4">
            <p className="text-sm text-gray-400">Achievements</p>
            <p className="mt-1 text-3xl font-semibold">{profile.achievements.length}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800 p-6">
        <h3 className="text-xl font-semibold">Perfect Quiz Badges</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {profile.achievements.length === 0 ? (
            <p className="text-gray-400">Perfect a quiz to unlock your first badge.</p>
          ) : (
            profile.achievements.map((achievement) => (
              <div key={achievement} className="rounded-xl border border-cyan-400/40 bg-slate-900 p-4">
                <p className="text-sm text-cyan-300">Badge</p>
                <p className="mt-1 font-semibold">{achievement}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-800 p-6">
        <h3 className="text-xl font-semibold">Recent Quiz Attempts</h3>
        <div className="mt-4 space-y-3">
          {profile.attempts.length === 0 ? (
            <p className="text-gray-400">Complete a quiz to start building your history.</p>
          ) : (
            profile.attempts.slice(0, 6).map((attempt) => (
              <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900 p-4">
                <div>
                  <p className="font-semibold">{attempt.quizTitle}</p>
                  <p className="text-sm text-gray-400">
                    {attempt.difficulty} - {attempt.score}/{attempt.total} - {formatTime(attempt.timeUsed)}
                  </p>
                </div>
                <p className="text-cyan-300">+{attempt.earnedXp} XP</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderViewedProfileView = () => {
    if (!viewedProfile) {
      return (
        <div className="rounded-2xl bg-slate-800 p-6">
          <h2 className="text-2xl font-semibold">Profile not selected</h2>
          <button
            type="button"
            onClick={() => setActiveView("Search")}
            className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
          >
            Back to search
          </button>
        </div>
      );
    }

    const viewedLevel = getLevelInfo(viewedProfile.xp);

    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-slate-800 p-6">
          <button
            type="button"
            onClick={() => setActiveView("Search")}
            className="mb-5 rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
          >
            Back to search
          </button>
          <p className="text-sm text-cyan-300">Profile</p>
          <h2 className="mt-2 text-3xl font-semibold">{viewedProfile.username}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-gray-400">Level</p>
              <p className="mt-1 text-3xl font-semibold text-cyan-300">{viewedLevel.level}</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-gray-400">Total XP</p>
              <p className="mt-1 text-3xl font-semibold">{viewedProfile.xp}</p>
            </div>
            <div className="rounded-xl bg-slate-900 p-4">
              <p className="text-sm text-gray-400">Achievements</p>
              <p className="mt-1 text-3xl font-semibold">{viewedProfile.achievements.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800 p-6">
          <h3 className="text-xl font-semibold">Achievements</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {viewedProfile.achievements.length === 0 ? (
              <p className="text-gray-400">This profile has no badges yet.</p>
            ) : (
              viewedProfile.achievements.map((achievement) => (
                <div key={achievement} className="rounded-xl border border-cyan-400/40 bg-slate-900 p-4">
                  <p className="text-sm text-cyan-300">Badge</p>
                  <p className="mt-1 font-semibold">{achievement}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRankingsView = () => (
    <div className="rounded-2xl bg-slate-800 p-6">
      <p className="text-sm text-cyan-300">Rankings</p>
      <h2 className="mt-2 text-3xl font-semibold">Quiz and Time Rankings</h2>
      <p className="mt-2 text-gray-400">
        Rankings sort by highest score first, then fastest time for that quiz and difficulty.
      </p>

      <div className="mt-6 space-y-6">
        {quizTopics.map((quiz) => (
          <div key={quiz.title} className="rounded-xl bg-slate-900 p-4">
            <h3 className="text-lg font-semibold">{quiz.title}</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {difficulties.map((level) => {
                const rows = leaderboard
                  .filter((entry) => entry.quizTitle === quiz.title && entry.difficulty === level)
                  .slice(0, 5);

                return (
                  <div key={level} className="rounded-xl border border-slate-700 p-4">
                    <p className="font-semibold text-cyan-300">{level}</p>
                    <div className="mt-3 space-y-2">
                      {rows.length === 0 ? (
                        <p className="text-sm text-gray-400">No attempts yet.</p>
                      ) : (
                        rows.map((entry, index) => (
                          <div key={`${entry.username}-${entry.quizTitle}-${entry.difficulty}-${index}`} className="flex justify-between gap-3 text-sm">
                            <span>{index + 1}. {entry.username}</span>
                            <span className="text-gray-400">
                              {entry.score}/{entry.total} - {formatTime(entry.timeUsed)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSearchView = () => {
    const foundProfile = savedProfiles.find(
      (friend) => friend.username.toLowerCase() === searchedProfileName.toLowerCase()
    );

    return (
    <div className="rounded-2xl bg-slate-800 p-6">
      <p className="text-sm text-cyan-300">Search</p>
      <h2 className="mt-2 text-3xl font-semibold">Find a Profile</h2>
      <p className="mt-2 text-gray-400">
        Search a username to view that profile and achievements. No profiles are shown until you search.
      </p>

      <form onSubmit={searchProfile} className="mt-6 flex flex-col gap-3 md:flex-row">
        <input
          value={profileSearch}
          onChange={(event) => setProfileSearch(event.target.value)}
          placeholder="Search username"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-300"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black hover:bg-cyan-400"
        >
          Search
        </button>
      </form>

      {searchedProfileName && !foundProfile && (
        <div className="mt-6 rounded-xl bg-slate-900 p-5">
          <p className="font-semibold">No profile found for "{searchedProfileName}".</p>
          <p className="mt-1 text-sm text-gray-400">Try another username.</p>
        </div>
      )}

      {foundProfile && (
        <button
          type="button"
          onClick={() => openViewedProfile(foundProfile)}
          className="mt-6 block max-w-xl rounded-xl bg-slate-900 p-5 text-left transition hover:bg-slate-700"
        >
          {(() => {
            const friendLevel = getLevelInfo(foundProfile.xp);

          return (
            <div>
              <p className="text-sm text-cyan-300">Profile</p>
              <h3 className="mt-1 text-2xl font-semibold">{foundProfile.username}</h3>
              <p className="mt-3 text-gray-400">
                Level {friendLevel.level} - {foundProfile.xp} XP
              </p>
              <div className="mt-3 h-2 rounded bg-slate-700">
                <div className="h-2 rounded bg-cyan-400" style={{ width: `${friendLevel.progress}%` }}></div>
              </div>
              <div className="mt-4 space-y-2">
                {foundProfile.achievements.map((achievement) => (
                  <div key={achievement} className="rounded-lg border border-cyan-400/40 px-3 py-2 text-sm">
                    {achievement}
                  </div>
                ))}
              </div>
            </div>
          );
          })()}
        </button>
      )}
    </div>
  );
  };

  const renderQuizView = () => {
    if (activeQuiz && isFinished) {
      return (
        <div className="rounded-2xl bg-slate-800 p-6">
          <p className="text-sm text-cyan-300">{activeQuiz.title}</p>
          <h2 className="mt-2 text-3xl font-semibold">Quiz complete</h2>
          <p className="mt-3 text-gray-400">
            You scored {score} out of {currentQuestions.length} on {difficulty}.
          </p>
          <p className="mt-2 text-cyan-300">
            +{resultXp} XP {score === currentQuestions.length ? "and a perfect badge unlocked." : "added to your profile."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={restartQuiz}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={closeQuiz}
              className="rounded-lg bg-slate-700 px-4 py-2 font-medium hover:bg-slate-600"
            >
              Back to quizzes
            </button>
          </div>
        </div>
      );
    }

    if (activeQuiz && currentQuestion) {
      return (
        <div className="rounded-2xl bg-slate-800 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={closeQuiz}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-600"
            >
              Back to quizzes
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-400">Time left</p>
              <p className="text-2xl font-semibold text-cyan-300">{formatTime(timeLeft)}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-cyan-300">{activeQuiz.title}</p>
              <h2 className="mt-2 text-2xl font-semibold">
                Question {questionIndex + 1} of {currentQuestions.length}
              </h2>
            </div>
            <p className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-gray-300">
              Score: {score}
            </p>
          </div>

          <div className="mt-5 h-2 rounded bg-slate-700">
            <div className="h-2 rounded bg-cyan-400" style={{ width: `${progress}%` }}></div>
          </div>

          <h3 className="mt-6 text-2xl font-semibold">{currentQuestion.question}</h3>

          <div className="mt-6 grid gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const showCorrect = selectedAnswer !== null && index === currentQuestion.answer;
              const showWrong = isSelected && !showCorrect;

              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => chooseAnswer(index)}
                  className={`rounded-xl border p-4 text-left transition ${
                    showCorrect
                      ? "border-emerald-400 bg-emerald-500/20"
                      : showWrong
                      ? "border-rose-400 bg-rose-500/20"
                      : "border-slate-700 bg-slate-900 hover:border-cyan-300"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div className="mt-6 rounded-xl bg-slate-900 p-4">
              <p className="font-semibold">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="mt-1 text-sm text-gray-400">{currentQuestion.explanation}</p>
              {!isCorrect && (
                <p className="mt-2 text-sm text-gray-300">
                  Correct answer: {currentQuestion.options[currentQuestion.answer]}
                </p>
              )}
              <button
                type="button"
                onClick={goToNextQuestion}
                className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black hover:bg-cyan-400"
              >
                {questionIndex === currentQuestions.length - 1 ? "Finish quiz" : "Next question"}
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="mb-6 rounded-2xl bg-slate-800 p-6">
          <h2 className="text-2xl font-semibold">Introduction to Networks Practice</h2>
          <p className="text-gray-400">
            Choose a module group. Each group has 10 Easy, 15 Medium, and 25 Hard questions.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex rounded-xl bg-slate-900 p-1">
              {difficulties.map((level) => (
                <button
                  type="button"
                  key={level}
                  onClick={() => changeDifficulty(level)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    difficulty === level ? "bg-cyan-500 text-black" : "text-gray-300 hover:bg-slate-800"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm">
              <span className="text-gray-300">Timer</span>
              <input
                type="range"
                min="1"
                max="30"
                value={timerMinutes}
                onChange={changeTimer}
                className="w-40 accent-cyan-400"
              />
              <span className="w-14 text-cyan-300">{timerMinutes} min</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {quizTopics.map((quiz) => (
            <QuizCard
              key={quiz.title}
              title={quiz.title}
              desc={`${quiz.desc} ${quiz.questions.filter((question) => question.difficulty === difficulty).length} ${difficulty.toLowerCase()} questions.`}
              onClick={() => startQuiz(quiz)}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={`flex min-h-screen ${isLightTheme ? "bg-slate-100 text-slate-950" : "bg-slate-900 text-white"}`}>
      <div className={`flex w-64 flex-col justify-between p-5 ${isLightTheme ? "bg-white" : "bg-slate-950"}`}>
        <div>
          <div className="mb-6 space-y-4">
            <button
              type="button"
              onClick={() => setActiveView("Profile")}
              className="w-full rounded-xl bg-slate-800 p-4 text-left transition hover:bg-slate-700"
            >
              <p className="text-xs text-cyan-300">Account</p>
              <p className="mt-1 text-lg font-semibold">{profile.username}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-400">Level {levelInfo.level}</span>
                <span className="text-cyan-300">{profile.xp} XP</span>
              </div>
              <div className="mt-2 h-2 w-full rounded bg-slate-700">
                <div className="h-2 rounded bg-cyan-400" style={{ width: `${levelInfo.progress}%` }}></div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {levelInfo.level >= maxLevel
                  ? "Max level reached"
                  : `${levelInfo.xpNeeded - levelInfo.xpIntoLevel} XP to next level`}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                {profile.achievements.length} achievements
              </p>
            </button>
          </div>

          <h1 className="mb-4 text-xl font-bold">RecallQuest</h1>

          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => openView(item)}
                className={`w-full rounded-lg p-3 text-left ${
                  activeView === item ? "bg-cyan-500 text-black" : "hover:bg-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsLightTheme((current) => !current)}
          className={`rounded-lg p-3 text-left text-sm ${
            isLightTheme ? "text-slate-600 hover:bg-slate-100" : "text-gray-400 hover:bg-slate-800"
          }`}
        >
          Theme: {isLightTheme ? "Light" : "Dark"}
        </button>
      </div>

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-5 flex justify-end">
          <form onSubmit={login} className="flex flex-wrap items-center justify-end gap-2">
            <input
              value={loginName}
              onChange={(event) => setLoginName(event.target.value)}
              placeholder="Username"
              className="w-48 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
            >
              Log out
            </button>
          </form>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
